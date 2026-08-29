import { Box, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { HiChartPie, HiClock, HiColorSwatch, HiLightningBolt, HiOutlineX, HiPuzzle, HiSparkles } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/terapeuta', label: 'Panel clínico', icon: <HiChartPie /> },
  { to: '/juegos/simon', label: 'Simón Dice', icon: <HiLightningBolt /> },
  { to: '/juegos/pinta', label: 'Pinta Feliz', icon: <HiColorSwatch /> },
  { to: '/juegos/traza', label: 'Traza Fácil', icon: <HiPuzzle /> },
  { to: '/juegos/rescate', label: 'Rescate', icon: <HiSparkles /> },
  { to: '/historial', label: 'Historial general', icon: <HiClock /> },
]

export default function Sidebar({ close }) {
  return (
    <Box sx={{ height: '100%', p: 2, bgcolor: '#fff' }}>
      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ px: 1, mb: 4 }}>
        <Box sx={{ bgcolor: 'primary.main', color: '#fff', p: 1, borderRadius: 2, display: 'grid', placeItems: 'center' }}><HiSparkles /></Box>
        <Typography variant="h6">Arcade Terapéutico</Typography>
        {close && <HiOutlineX style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={close} />}
      </Stack>
      <List disablePadding>
        {links.map(({ to, label, icon }) => (
          <ListItemButton
            key={to}
            component={NavLink}
            to={to}
            onClick={close}
            sx={{ mb: .75, borderRadius: 2, '&.active': { bgcolor: 'primary.main', color: '#fff' }, '&.active .MuiListItemIcon-root': { color: '#fff' } }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
