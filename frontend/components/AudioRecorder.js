'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2, Loader2 } from 'lucide-react';

export default function AudioRecorder({ onRecorded }) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        onRecorded(blob, url);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);

      // Timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setDuration(seconds);
        if (seconds >= 120) stopRecording(); // Max 2 min
      }, 1000);
    } catch (err) {
      alert('تعذر الوصول إلى المايكروفون. تأكد من الإذن.');
    }
  };


  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const clearRecording = () => {
    setAudioUrl('');
    setAudioBlob(null);
    setDuration(0);
    setRecording(false);
    onRecorded(null, '');
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {!audioUrl ? (
        <button
  type="button"
  onClick={recording ? stopRecording : startRecording}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed transition-all ${
            recording
              ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-pulse'
              : 'border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800/50 text-surface-600 dark:text-surface-400 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
          }`}
        >
          {recording ? (
            <>
              <Square size={20} className="fill-red-500" />
              <span className="font-medium">إيقاف التسجيل — {formatTime(duration)}</span>
            </>
          ) : (
            <>
              <Mic size={24} />
              <span className="font-medium">اضغط لبدء التسجيل</span>
            </>
          )}
        </button>
      ) : (
        <div className="card !p-4">
          <div className="flex items-center gap-4">
            <audio
              src={audioUrl}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="flex-1 h-10"
            />
            <button
  type="button"
  onClick={clearRecording}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all"
              title="حذف التسجيل"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="text-xs text-surface-400 mt-2">
            ✅ تم التسجيل — {formatTime(duration)}
          </div>
        </div>
      )}
    </div>
  );
}
