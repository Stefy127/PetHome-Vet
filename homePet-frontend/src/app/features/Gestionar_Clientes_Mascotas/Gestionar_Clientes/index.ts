// Screen
export { GestionarClientes } from './screen'

// Components
export {
  ClienteForm,
  ClientesTable,
  ClienteDialog,
  DeleteClienteConfirmation,
} from './components'

// Types & Store exports (from new RTK Query store)
export type { Cliente, ClienteCreatePayload, ClienteUpdatePayload } from './store'
