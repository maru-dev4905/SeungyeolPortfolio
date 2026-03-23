import type { MouseEvent, ReactNode } from 'react'
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  type LinkProps,
  type NavLinkProps,
} from 'react-router-dom'

const TRANSITION_DELAY = 700

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
}

function useTransitionHandler(to: LinkProps['to']) {
  const navigate = useNavigate()
  const location = useLocation()

  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      isModifiedEvent(event) ||
      typeof to !== 'string'
    ) {
      return
    }

    if (to === location.pathname + location.search + location.hash) {
      return
    }

    event.preventDefault()
    document.documentElement.classList.add('is-changing')

    window.setTimeout(() => {
      navigate(to)
    }, TRANSITION_DELAY)
  }
}

type TransitionLinkProps = Omit<LinkProps, 'children'> & {
  children: ReactNode
}

export function TransitionLink({ children, onClick, to, ...props }: TransitionLinkProps) {
  const handleTransition = useTransitionHandler(to)

  return (
    <Link
      {...props}
      to={to}
      onClick={(event) => {
        onClick?.(event)
        handleTransition(event)
      }}
    >
      {children}
    </Link>
  )
}

type TransitionNavLinkProps = Omit<NavLinkProps, 'children'> & {
  children: ReactNode
}

export function TransitionNavLink({
  children,
  onClick,
  to,
  ...props
}: TransitionNavLinkProps) {
  const handleTransition = useTransitionHandler(to)

  return (
    <NavLink
      {...props}
      to={to}
      onClick={(event) => {
        onClick?.(event)
        handleTransition(event)
      }}
    >
      {children}
    </NavLink>
  )
}
