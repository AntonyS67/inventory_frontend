import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export const Notify = (message, type) => {
  switch (type) {
    case 'success':
      return toast.success(message, {
        autoClose: 2000
      })
    case 'error':
      return toast.error(message, {
        autoClose: 2000
      })
    case 'info':
      return toast.info(message, {
        autoClose: 2000
      })
    default:
      return toast.success(message, {
        autoClose: 2000
      })
  }
}
