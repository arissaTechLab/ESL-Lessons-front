import { Link } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'

export function CtaSection() {
  return (
    <section id="pricing" className="scroll-mt-20 bg-accent-300">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Ready to Save Time and
          <br />
          Teach Better Lessons?
        </h2>
        <p className="mt-4 text-ink-soft">
          Start teaching with confidence — no prep required.
        </p>
        <Link
          to={APP_ROUTES.SIGNUP}
          className={buttonVariants('primary', 'md', 'mt-8')}
        >
          Sign up
        </Link>
      </div>
    </section>
  )
}
