import { Paper, Typography } from '@mui/material'
export default function ChartCard({ title, children }) { return <Paper sx={{ p: 2.5, height: '100%' }}><Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography><div className="chart-wrap">{children}</div></Paper> }
