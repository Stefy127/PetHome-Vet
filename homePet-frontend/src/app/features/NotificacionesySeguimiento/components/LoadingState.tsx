import { Card, CardContent } from '#/components/ui/card'

export function LoadingState() {
  return (
    <div className="space-y-4">
      <Card className="border-violet-100">
        <CardContent className="p-6">
          <div className="h-8 w-64 animate-pulse rounded-md bg-slate-200" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

