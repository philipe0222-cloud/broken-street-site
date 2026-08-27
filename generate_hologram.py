import math
import wave
import struct

out = 'assets/soundtrack/hologram.wav'
framerate = 22050
seconds = 0.22
samples = int(framerate * seconds)
frames = []

for i in range(samples):
    t = i / framerate
    freq = 720 + 460 * (t / seconds)
    env = math.exp(-4.2 * (t / seconds))
    v = env * 0.35 * math.sin(2 * math.pi * freq * t)
    v += 0.08 * env * math.sin(2 * math.pi * (freq * 1.7) * t)
    val = int(max(-1, min(1, v)) * 32767)
    frames.append(struct.pack('<h', val))

with wave.open(out, 'wb') as wav:
    wav.setnchannels(1)
    wav.setsampwidth(2)
    wav.setframerate(framerate)
    wav.writeframes(b''.join(frames))

print(out)
