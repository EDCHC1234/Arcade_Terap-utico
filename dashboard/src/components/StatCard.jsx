import { Paper, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export default function StatCard({ title, value, subtitle, icon, color = '#7c5cff' }) {
  return <Paper component={motion.div} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} sx={{ p: 2.5, minHeight: 144 }}><Stack direction="row" justifyContent="space-between"><div><Typography color="text.secondary" variant="body2">{title}</Typography><Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography><Typography color="text.secondary" variant="caption">{subtitle}</Typography></div><Stack alignItems="center" justifyContent="center" sx={{ width: 46, height: 46, borderRadius: 3, color, bgcolor: `${color}22`, fontSize: 23 }}>{icon}</Stack></Stack></Paper>
}
