import { Placeholder } from '@/shared/components'

export function NoteFromLindsaySection() {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* Copy */}
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            A letter from the author
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Fan of the Deep Dive? Me too.
          </h2>
          <div className="mt-5 space-y-4 text-ink-soft">
            <p>
              Oh, I’m so glad you’ve made it here! If you’re a fellow lover of
              the long-format story, carry on. This is the path that lead me to
              creating these lesson materials for you.
            </p>
            <p>
              When I started teaching ESL online, most students wanted to
              improve their speaking fluency. Growing up, they’d studied grammar
              and vocabulary at school, but they’d never gotten a chance to
              develop their speaking skills.
            </p>
            <p>
              I had a whole arsenal of speaking activities from my years of
              teaching in the classroom - but I didn’t have online materials for
              a one-on-one class. This was a completely different ballgame. No
              more group dynamic, and no more textbook, photocopier, or limits,
              really!
            </p>
            <p>
              And yet...all I could find online was that same texbook format -
              now transformed into a PDF. Vocabulary was “match the definition
              to the word,” or multiple choice, and grammar was
              fill-in-the-blank. There was the ubiquitous “10 phrasal verbs with
              off”worksheet - a single, sad, stock photo gracing the top of its
              digital page. I had a flashback to the early 90's...I was sitting
              on the plaid sofa in my basement, watching a rerun of “The
              Poseidon Adventure”- the part where the lead character bellows at
              the doomed passengers of the sinking ship, “You’re going the wrong
              way!”
            </p>
            <p>
              I mean COME ON. There must be a better way. But it would be a
              while before I had the time to invest in actually figuring that
              out.
            </p>
          </div>
        </div>

        {/* Portrait — supplied later */}
        <Placeholder label="Photo" className="aspect-[4/5] w-full" />
      </div>
    </section>
  )
}
