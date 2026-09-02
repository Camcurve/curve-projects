import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import ChannelStatsPreview from '@/components/ChannelStatsPreview'
import Confetti from '@/components/Confetti'
import LoomFrame from '@/components/LoomFrame'

export default function Welcome({ client }) {
  const navigate = useNavigate()

  const footer = (
    <Button size="block" withArrow onClick={() => navigate(`/${client.slug}/brief`)}>
      Let&apos;s begin
    </Button>
  )

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 22 } },
  }

  return (
    <Layout client={client} currentStep="welcome" footer={footer}>
      <Confetti />
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
        className="flex flex-col gap-7"
      >
        <motion.h1
          variants={item}
          className="font-display text-[52px] font-extrabold leading-[0.95] tracking-[-0.04em] text-bone sm:text-[64px]"
        >
          Welcome,
          <br />
          <span className="text-brand">{client.name}.</span>
        </motion.h1>

        <motion.p variants={item} className="max-w-[42ch] text-[16px] leading-[1.55] text-bone-dim">
          A short walkthrough from Cam, then four quick steps so we can plug straight into
          your channel. Takes about five minutes — your answers save as you go.
        </motion.p>

        {client.stats && (
          <motion.div variants={item}>
            <ChannelStatsPreview stats={client.stats} brand={client.name} />
          </motion.div>
        )}

        <motion.div variants={item}>
          <LoomFrame client={client} url={import.meta.env.VITE_LOOM_URL} />
        </motion.div>
      </motion.div>
    </Layout>
  )
}
