import { Card, CardContent, CardTitle } from '#/components/ui/card'
import { formatCurrencyBs } from '../utils/ventasFormatters'

type VentaResumenCardProps = {
  title: string
  amount: number
  note?: string
}

export function VentaResumenCard({ title, amount, note }: VentaResumenCardProps) {
  return (
    <Card className="border-violet-100">
      <CardContent className="space-y-2 p-4">
        <CardTitle className="text-sm font-semibold text-slate-500">{title}</CardTitle>
        <p className="text-4xl font-black text-slate-900">{formatCurrencyBs(amount)}</p>
        {note ? <p className="text-xs text-slate-500">{note}</p> : null}
      </CardContent>
    </Card>
  )
}
