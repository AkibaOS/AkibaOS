import { useState, useEffect, useCallback, useRef } from 'react'
import '../assets/css/boot.css'

enum BootStatus {
  OK = 'ok',
  FAIL = 'fail',
  RETRYING = 'retrying',
  TESTING = 'testing'
}

type BootMessage = {
  message: string
  status: BootStatus
  delay: number
  failChance: number
  retryCount: number
}

function randomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateIP(): string {
  const ip: number[] = []
  for (let i = 0; i < 4; i++) {
    ip.push(Math.floor(Math.random() * 256))
  }
  return ip.join('.')
}

function generateMAC(): string {
  const mac: string[] = []
  for (let i = 0; i < 6; i++) {
    mac.push(
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
    )
  }
  return mac.join(':')
}

const ASCII_ART = `
      __       __   ___   __     _______       __              ______    ________
     /""\\     |/"| /  ") |" \\   |   _  "\\     /""\\            /    " \\  /"       )
    /    \\    (: |/   /  ||  |  (. |_)  :)   /    \\          // ____  \\(:   \\___/
   /' /\\  \\   |    __/   |:  |  |:     \\/   /' /\\  \\        /  /    ) :)\\___  \\
  //  __'  \\  (// _  \\   |.  |  (|  _  \\\\  //  __'  \\      (: (____/ //  __/  \\\\
 /   /  \\\\  \\ |: | \\  \\  /\\  |\\ |: |_)  :)/   /  \\\\  \\      \\        /  /" \\   :)
(___/    \\___)(__|  \\__)(__\\_|_)(_______/(___/    \\___)      \\"_____/  (_______/
`

const COPYRIGHT_NOTICE = `
Akiba OS v0.1.0

COPYRIGHT (C) 19XX Akiba OS Development Team

All Rights Reserved.

This software is provided "as is" without warranty of any kind.
Use at your own risk.

Welcome to Akiba OS!
`

const BOOT_MESSAGES: BootMessage[] = [
  {
    message: 'NeoCore BIOS v2.34 (C) 19XX Akiba NeoCore Division',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0,
    retryCount: 0
  },
  {
    message: 'Performing system integrity check...',
    status: BootStatus.OK,
    delay: randomDelay(1000, 2000),
    failChance: 0,
    retryCount: 0
  },
  {
    message: 'CPU: Quantum X68 322MHz',
    status: BootStatus.OK,
    delay: randomDelay(2500, 5000),
    failChance: 0.01,
    retryCount: 0
  },
  {
    message: 'Memory Test: 16384K',
    status: BootStatus.OK,
    delay: randomDelay(4000, 8000),
    failChance: 0,
    retryCount: 0
  },
  {
    message: 'VesperTech VGA Adapter',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > VESA BIOS v3.0',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0,
    retryCount: 0
  },
  {
    message: '  > Truecolor, 64M VRAM',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'PrimeDisk Disk Controller',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > 2 IDE Channels',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: '  > 4 devices detected',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '    - 2.5GB HDD',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '    - 1.44MB FDD',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '    - 32X CD-ROM',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '    - 100MB ZIP Drive',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'LunaPort USB Host Controller',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > 2 USB 1.1 ports',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'NovaSonic Audio Experience Adapter',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'ZenithNet Ethernet Adapter 10/100',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.1,
    retryCount: 0
  },
  {
    message: 'NovaTech NVRAM Controller',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > 128KB NVRAM',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: '  > Battery Status: OK',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'PX/2 Mouse: Detected',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'PX/2 Keyboard: Detected',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'Initializing System Management Mode...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Loading ACPI tables...',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Verifying DMI pool data...',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'Detecting PnP devices...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'BIOS setup completed',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.01,
    retryCount: 0
  },
  {
    message: 'Booting from PrimeDisk HDD...',
    status: BootStatus.OK,
    delay: randomDelay(3500, 8000),
    failChance: 0,
    retryCount: 0
  },
  {
    message: 'Loading Akiba OS v0.1.0...',
    status: BootStatus.OK,
    delay: randomDelay(2500, 5000),
    failChance: 0,
    retryCount: 0
  },
  {
    message: 'Verifying system integrity...',
    status: BootStatus.OK,
    delay: randomDelay(3500, 4000),
    failChance: 0,
    retryCount: 0
  },
  {
    message: 'Loading Akiba OS Kernel...',
    status: BootStatus.OK,
    delay: randomDelay(6000, 10000),
    failChance: 0,
    retryCount: 0
  },
  {
    message: 'Initializing memory management...',
    status: BootStatus.OK,
    delay: randomDelay(500, 1000),
    failChance: 0,
    retryCount: 0
  },
  {
    message: 'Initializing process scheduler...',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Loading device drivers...',
    status: BootStatus.OK,
    delay: randomDelay(500, 1000),
    failChance: 0.1,
    retryCount: 0
  },
  {
    message: '  > VesperTech VGA Driver',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > PrimeDisk Disk Driver',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > LunaPort USB Driver',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > NovaSonic Audio Driver',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > ZenithNet Ethernet Driver',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > NovaTech NVRAM Driver',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > PX/2 Mouse Driver',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > PX/2 Keyboard Driver',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Mounting filesystems...',
    status: BootStatus.OK,
    delay: randomDelay(500, 1000),
    failChance: 0.1,
    retryCount: 0
  },
  {
    message: 'Performing filesystem check...',
    status: BootStatus.OK,
    delay: randomDelay(1500, 3500),
    failChance: 0.1,
    retryCount: 0
  },
  {
    message: 'Loading system configuration...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing system services...',
    status: BootStatus.OK,
    delay: randomDelay(500, 1000),
    failChance: 0.1,
    retryCount: 0
  },
  {
    message: '  > Akiba Core Services',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > AKFS FileSystem Service',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > Network Stack Service',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > Audio Service',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > USB Service',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > Display Service',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > Input Service',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > System Management Service',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: '  > Security Service',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing network...',
    status: BootStatus.OK,
    delay: randomDelay(500, 1000),
    failChance: 0.1,
    retryCount: 0
  },
  {
    message: '  > Ethernet Link Connected (10 Mbps)',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.1,
    retryCount: 0
  },
  {
    message: '  > Acquiring IP address...',
    status: BootStatus.OK,
    delay: randomDelay(500, 1000),
    failChance: 0.1,
    retryCount: 0
  },
  {
    message: '  > IP Address: ' + generateIP(),
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0,
    retryCount: 0
  },
  {
    message: '  > Subnet Mask: ' + generateIP(),
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0,
    retryCount: 0
  },
  {
    message: '  > Gateway: ' + generateIP(),
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0,
    retryCount: 0
  },
  {
    message: '  > DNS: ' + generateIP(),
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0,
    retryCount: 0
  },
  {
    message: '  > MAC Address: ' + generateMAC(),
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0,
    retryCount: 0
  },
  {
    message: 'Initializing audio subsystem...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing USB subsystem...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing input devices...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Loading system fonts...',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'Initializing power management...',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Loading user profiles...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing system background tasks...',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'Loading desktop environment...',
    status: BootStatus.OK,
    delay: randomDelay(500, 1000),
    failChance: 0.1,
    retryCount: 0
  },
  {
    message: '  > Akiba Desktop Experience',
    status: BootStatus.OK,
    delay: randomDelay(2500, 5000),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing window manager...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Loading desktop icons...',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'Initializing control bar...',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'Initializing system clock...',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.01,
    retryCount: 0
  },
  {
    message: 'Loading startup programs...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing virtual memory...',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Performing final system checks...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Optimizing system performance...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing system recovery services...',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Checking disk quotas...',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'Initializing print spooler...',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'Initializing system logs...',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.01,
    retryCount: 0
  },
  {
    message: 'Verifying system integrity...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing networking protocols...',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Loading firewall rules...',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing system monitors...',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'Performing cleanup...',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing user interface...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Loading user preferences...',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0.02,
    retryCount: 0
  },
  {
    message: 'Initializing clipboard...',
    status: BootStatus.OK,
    delay: randomDelay(50, 150),
    failChance: 0.01,
    retryCount: 0
  },
  {
    message: 'Checking for peripheral devices...',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Initializing system search indexer...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Loading user session...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Finalizing boot sequence...',
    status: BootStatus.OK,
    delay: randomDelay(250, 500),
    failChance: 0.05,
    retryCount: 0
  },
  {
    message: 'Boot Complete! Akiba OS Ready!',
    status: BootStatus.OK,
    delay: randomDelay(150, 350),
    failChance: 0.01,
    retryCount: 0
  },
  {
    message: 'Welcome to Akiba OS!',
    status: BootStatus.OK,
    delay: randomDelay(100, 250),
    failChance: 0,
    retryCount: 0
  }
]

const BootScreen: React.FC = () => {
  const [displayedLines, setDisplayedLines] = useState<BootMessage[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [bootComplete, setBootComplete] = useState(false)
  const [, setMemoryTestProgress] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const startBeep = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    if (audioContextRef.current) {
      oscillatorRef.current = audioContextRef.current.createOscillator()
      oscillatorRef.current.type = 'sine'
      oscillatorRef.current.frequency.setValueAtTime(440, audioContextRef.current.currentTime) // 440 Hz - A4 note
      oscillatorRef.current.connect(audioContextRef.current.destination)
      oscillatorRef.current.start()
    }
  }, [])

  const stopBeep = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current.disconnect()
      oscillatorRef.current = null
    }
  }, [])

  const scrollToBottom = (): void => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }

  useEffect(scrollToBottom, [displayedLines])

  const processLine = useCallback((index: number) => {
    const currentMessage = BOOT_MESSAGES[index]
    const randomValue = Math.random()

    if (currentMessage.message.startsWith('Memory Test:')) {
      // Special handling for memory test
      setMemoryTestProgress(0) // Reset progress
      return
    }

    if (randomValue < currentMessage.failChance) {
      setDisplayedLines((prev) => {
        const newLines = [...prev]
        newLines[index] = {
          ...currentMessage,
          status: BootStatus.FAIL,
          retryCount: (newLines[index]?.retryCount || 0) + 1
        }
        return newLines
      })

      setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev]
          newLines[index] = { ...newLines[index], status: BootStatus.RETRYING }
          return newLines
        })
        setTimeout(() => processLine(index), randomDelay(500, 1000))
      }, 1000)
    } else {
      setDisplayedLines((prev) => {
        const newLines = [...prev]
        newLines[index] = {
          ...currentMessage,
          status: BootStatus.OK,
          retryCount: newLines[index]?.retryCount || 0
        }
        return newLines
      })
      setTimeout(() => setCurrentLineIndex((prev) => prev + 1), 100)
    }
  }, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)
    return (): void => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (currentLineIndex < BOOT_MESSAGES.length) {
      const currentMessage = BOOT_MESSAGES[currentLineIndex]

      if (currentMessage.message.startsWith('Memory Test:')) {
        // Memory test animation
        const totalSteps = 100
        const stepSize = 16384 / totalSteps
        const stepDuration = currentMessage.delay / totalSteps

        startBeep() // Start beeping

        const animate = (step: number): void => {
          if (step <= totalSteps) {
            const progress = Math.floor(step * stepSize)
            setMemoryTestProgress(progress)
            setDisplayedLines((prev) => {
              const newLines = [...prev]
              newLines[currentLineIndex] = {
                ...currentMessage,
                message: `Memory Test: ${progress}K`,
                status: BootStatus.TESTING
              }
              return newLines
            })
            setTimeout(() => animate(step + 1), stepDuration)
          } else {
            // Animation complete
            stopBeep() // Stop beeping
            setDisplayedLines((prev) => {
              const newLines = [...prev]
              newLines[currentLineIndex] = {
                ...currentMessage,
                message: 'Memory Test: 16384K',
                status: BootStatus.OK
              }
              return newLines
            })
            setTimeout(() => setCurrentLineIndex((prev) => prev + 1), 100)
          }
        }

        animate(1)
      } else {
        // Normal message processing
        const timer = setTimeout(() => {
          setDisplayedLines((prev) => [
            ...prev,
            { ...currentMessage, status: BootStatus.RETRYING, retryCount: 0 }
          ])
          processLine(currentLineIndex)
        }, currentMessage.delay)

        return (): void => clearTimeout(timer)
      }
    } else if (currentLineIndex === BOOT_MESSAGES.length && !bootComplete) {
      setBootComplete(true)
    }
    return undefined
  }, [currentLineIndex, bootComplete, processLine])

  const getStatusClass = (status: BootStatus): string => {
    switch (status) {
      case BootStatus.OK:
        return 'status-ok'
      case BootStatus.FAIL:
        return 'status-fail'
      case BootStatus.RETRYING:
        return 'status-retrying'
      case BootStatus.TESTING:
        return 'status-testing'
      default:
        return ''
    }
  }

  return (
    <div className="boot-screen-container">
      <div className="boot-screen-content" ref={contentRef}>
        <pre className="ascii-art">{ASCII_ART}</pre>
        <pre className="copyright">{COPYRIGHT_NOTICE}</pre>
        <div className="boot-messages">
          {displayedLines.map((message, index) => (
            <div key={index} className="boot-message">
              <span className={`boot-message-status ${getStatusClass(message.status)}`}>
                {message.status === BootStatus.TESTING
                  ? '[TESTING]'
                  : `[${message.status.toUpperCase()}]`}
              </span>
              <span className="boot-message-text">
                {message.message}
                {message.retryCount > 0 && ` (Retries: ${message.retryCount})`}
              </span>
            </div>
          ))}
          {currentLineIndex < BOOT_MESSAGES.length && (
            <span
              className="boot-cursor"
              style={{ visibility: cursorVisible ? 'visible' : 'hidden' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BootScreen
