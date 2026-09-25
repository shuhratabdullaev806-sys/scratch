#!/usr/bin/env bash
# 4 soniyalik pauzalarni 3 soniyaga qisqartiradi.
#
# Diktor 4 soniya pauza bilan yozadi, bu skript har bir jimlikning
# o'rtasidan 1 soniya kesib tashlaydi. Chetlari tegilmaydi, shuning uchun
# nafas olish tovushlari va so'z boshlari kesilmaydi.
#
#   ./pauzani-qisqartir.sh <kirish.mp4> <chiqish.mp4>
#
# Oxirida yangi jimlik vaqtlarini chiqaradi — ularni timeline.ts ga ko'chiring.

set -euo pipefail

# Diqqat: ${var:?xabar} ichida apostrof ishlatilmasin — bash uni
# qo'shtirnoq deb o'qiydi va qolgan skriptni buzadi.
IN=${1:?kirish fayli berilmagan}
OUT=${2:?chiqish fayli berilmagan}
CUT=${CUT:-1.0}     # har pauzadan necha soniya kesiladi
GUARD=${GUARD:-0.6} # jimlik chetlaridan qancha uzoqda kesiladi

FFMPEG=${FFMPEG:-ffmpeg}

echo "1/3  Pauzalarni qidiryapman..."
mapfile -t GAPS < <(
  "$FFMPEG" -i "$IN" -af "silencedetect=noise=-35dB:d=2.6" -f null - 2>&1 |
    grep -oE 'silence_(start|end): [0-9.]+' | awk '{print $2}' | paste - -
)

if [ ${#GAPS[@]} -eq 0 ]; then
  echo "Jimlik topilmadi. Pauzalar yetarli uzunmi?" >&2
  exit 1
fi
echo "     ${#GAPS[@]} ta pauza topildi."

# Har bir pauza o'rtasidan CUT soniya olib tashlanadi.
KEEP_FROM=0
FILTER=""
N=0
for g in "${GAPS[@]}"; do
  S=$(echo "$g" | cut -f1)
  E=$(echo "$g" | cut -f2)
  LEN=$(awk "BEGIN{print $E-$S}")
  if (( $(awk "BEGIN{print ($LEN < $CUT + 2*$GUARD)}") )); then
    echo "     $S-$E juda qisqa ($LEN s), tegilmadi."
    continue
  fi
  MID=$(awk "BEGIN{print ($S+$E)/2}")
  A=$(awk "BEGIN{print $MID-$CUT/2}")
  B=$(awk "BEGIN{print $MID+$CUT/2}")
  N=$((N + 1))
  FILTER+="[0:v]trim=${KEEP_FROM}:${A},setpts=PTS-STARTPTS[v${N}];"
  FILTER+="[0:a]atrim=${KEEP_FROM}:${A},asetpts=PTS-STARTPTS[a${N}];"
  KEEP_FROM=$B
done

N=$((N + 1))
FILTER+="[0:v]trim=${KEEP_FROM},setpts=PTS-STARTPTS[v${N}];"
FILTER+="[0:a]atrim=${KEEP_FROM},asetpts=PTS-STARTPTS[a${N}];"
for i in $(seq 1 $N); do FILTER+="[v${i}][a${i}]"; done
FILTER+="concat=n=${N}:v=1:a=1[v][a]"

echo "2/3  Kesyapman..."
"$FFMPEG" -i "$IN" -filter_complex "$FILTER" -map '[v]' -map '[a]' \
  -c:v libx264 -crf 16 -preset medium -c:a aac -b:a 160k "$OUT" -y -loglevel error

echo "3/3  Yangi vaqtlar — timeline.ts ga ko'chiring:"
echo
# ffmpeg -i chiqish faylisiz xato kodi qaytaradi, shuning uchun || true.
probe() { "$FFMPEG" "$@" 2>&1 || true; }

echo "  Uzunlik (DURATION_S):"
probe -i "$OUT" | grep Duration | sed 's/^/  /'
echo
echo "  Pauzalar (pauseFrom / pauseTo):"
probe -i "$OUT" -af "silencedetect=noise=-35dB:d=1.8" -f null - |
  grep -oE 'silence_(start|end): [0-9.]+' | awk '{print $2}' | paste - - |
  awk '{printf "    pauseFrom: %.2f,  pauseTo: %.2f\n", $1, $2}'
echo
echo "  Jumla chegaralari (labelAt / textFrom / explainFrom / explainTo):"
probe -i "$OUT" -af "silencedetect=noise=-33dB:d=0.35" -f null - |
  grep -oE 'silence_(start|end): [0-9.]+' | awk '{print $2}' | paste - - |
  awk '{printf "    jimlik %.2f - %.2f\n", $1, $2}'
