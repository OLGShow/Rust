import { forwardRef, createContext, useContext, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const DialogContext = createContext()

const Dialog = ({ children, ...props }) => {
  const [open, setOpen] = useState(false)
  
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <div {...props}>{children}</div>
    </DialogContext.Provider>
  )
}

const DialogTrigger = forwardRef(({ className, children, ...props }, ref) => {
  const { setOpen } = useContext(DialogContext)
  
  return (
    <div
      ref={ref}
      className={cn(className)}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </div>
  )
})
DialogTrigger.displayName = 'DialogTrigger'

const DialogContent = forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useContext(DialogContext)
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        ref={ref}
        className={cn(
          'relative z-50 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border bg-background p-6 shadow-lg',
          className
        )}
        {...props}
      >
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
})
DialogContent.displayName = 'DialogContent'

const DialogHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
    {...props}
  />
))
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} 