import { Placeholder } from '@/shared/components'

/** Fixed instructional content for the Google Slides tutorial page. */
export function EditorSlideshowSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="font-heading text-2xl font-bold leading-tight text-ink sm:text-3xl">
          Familiarize yourself with both ‘Editor’ &amp; ‘Slideshow’ Mode
        </h2>

        <div className="mt-6 space-y-4 text-sm text-ink-soft">
          <p>
            There are two ways in which you can conduct lessons using the Google
            Slides, either in editor mode or slideshow mode. It’s great to get
            acquainted with both for teaching.
          </p>
          <p>
            Whenever you click the link for a Google Slide E-Lesson and confirm
            making a copy, the lesson will open up in the default editor mode.
            You can see an example below:
          </p>
        </div>

        <Placeholder
          label="Editor mode screenshot"
          className="mt-8 aspect-video w-full"
        />

        <div className="mt-8 space-y-4 text-sm text-ink-soft">
          <p>
            The advantage of editor mode is that you have the toolbar above the
            slides at your fingertips, allowing you to add or edit text, move
            content around, or make other changes. You should always use editor
            mode when students are prompted to type something or tick (✅) boxes,
            unless you have some kind of on-screen annotation tool/extension to
            use in slideshow mode (see below “Use an annotation tool in
            slideshow mode”). In editor mode, when you have the tick marks, you
            can simply drag and drop them to the boxes.
          </p>
          <p>
            Please keep in mind that some of the activities are repeated — one
            slide for the student activity, and the following slide to show the
            answers. This is to help minimize your reference to the teacher
            guide and facilitate the flow of the lesson; however, some teachers
            may not want them. If you wish, you can always delete the answer
            slides by going through the lesson before conducting it.
          </p>
          <p>
            In order to enter slideshow mode, you can see the button in the top
            right corner:
          </p>
        </div>

        <Placeholder
          label="Slideshow mode screenshot"
          className="mt-8 aspect-video w-full"
        />

        <p className="mt-8 text-sm text-ink-soft">
          Slideshow mode is nice because it lays all of the content out in full
          screen, so everything looks a bit more cleanly presented than it does
          in editor mode. You can also very easily scroll through the slides
          with the arrow keys (up ↑, down ↓) on your keyboard. The main
          disadvantage of slideshow mode is that you’re not able to edit the
          slides or move things around. You can really just navigate through the
          slides, unless you have an annotation tool available.
        </p>
      </div>
    </section>
  )
}
