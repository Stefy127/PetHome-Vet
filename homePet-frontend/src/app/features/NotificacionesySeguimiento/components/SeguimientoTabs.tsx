import { Button } from '#/components/ui/button'

export type SeguimientoTab = 'TODOS' | 'CITAS' | 'SERVICIOS' | 'PEDIDOS'

type SeguimientoTabsProps = {
  activeTab: SeguimientoTab
  onChange: (tab: SeguimientoTab) => void
  disabled?: boolean
}

const tabs: Array<{ key: SeguimientoTab; label: string }> = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'CITAS', label: 'Citas' },
  { key: 'SERVICIOS', label: 'Servicios' },
  { key: 'PEDIDOS', label: 'Pedidos' },
]

export function SeguimientoTabs({ activeTab, onChange, disabled }: SeguimientoTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <Button
            key={tab.key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tab.key)}
            className={
              isActive
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'border-violet-300 bg-white text-violet-700 hover:bg-violet-50'
            }
            variant={isActive ? 'default' : 'outline'}
          >
            {tab.label}
          </Button>
        )
      })}
    </div>
  )
}

