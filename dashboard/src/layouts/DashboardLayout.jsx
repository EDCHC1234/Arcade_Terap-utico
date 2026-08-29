import { useState } from 'react'
import { Box, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import { HiMenuAlt2 } from 'react-icons/hi'
import Sidebar from '../components/Sidebar'

const drawerWidth = 252

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }}>
        <Drawer variant="temporary" open={open} onClose={() => setOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
          <Sidebar close={() => setOpen(false)} />
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 0 } }} open>
          <Sidebar />
        </Drawer>
      </Box>
      <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
        <Toolbar sx={{ px: { xs: 2, md: 4 }, justifyContent: 'space-between', bgcolor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton sx={{ display: { md: 'none' } }} onClick={() => setOpen(true)}><HiMenuAlt2 /></IconButton>
            <Typography color="text.secondary" variant="body2">Detalle de actividad terapéutica</Typography>
          </Stack>
          <Typography variant="body2" color="secondary.main">ESP32 · MQTT · Firebase</Typography>
        </Toolbar>
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1600, mx: 'auto', minWidth: 0 }}>{children}</Box>
      </Box>
    </Box>
  )
}
