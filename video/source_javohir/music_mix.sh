#!/bin/bash
# mix.sh SPEECH.wav DURATION ENDCARD_START OUT.wav
S=$1; D=$2; T=$3; O=$4
B=$(python3 -c "print(10**(5/20))")
ffmpeg -loglevel error -y -i "$S" -i track.mp3 -filter_complex "\
[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0,asplit=2[sp][sc];\
[1:a]aresample=48000,atrim=0:$D,asetpts=PTS-STARTPTS,volume=-14dB,\
volume='if(lt(t,$T),1,min(1+($B-1)*(t-$T)/0.7,$B))':eval=frame,\
afade=t=in:st=0:d=1.2,afade=t=out:st=$(python3 -c "print($D-1.8)"):d=1.8[m];\
[m][sc]sidechaincompress=threshold=0.04:ratio=2:attack=30:release=600:knee=6[md];\
[sp][md]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.93[a]" -map "[a]" -ar 48000 -t $D "$O"
