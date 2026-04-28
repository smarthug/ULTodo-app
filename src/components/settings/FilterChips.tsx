import { useTaskStore } from '@/features/tasks/task-store'
import { Button } from '@/components/ui/button'
import { TagChip } from '@/components/task/TagChip'

interface Props {
  showHeading?: boolean
  layout?: 'stacked' | 'inline'
}

export function FilterChips({ showHeading = true, layout = 'stacked' }: Props) {
  const store = useTaskStore()
  const isInline = layout === 'inline'

  const projectButtons = (
    <>
      <Button
        variant={store.settings.activeProjectId === 'all' ? 'default' : 'soft'}
        size={isInline ? 'sm' : 'md'}
        onClick={() => store.setSettings({ activeProjectId: 'all' })}
      >
        All projects
      </Button>
      {store.projects.map((project) => (
        <Button
          key={project.id}
          variant={store.settings.activeProjectId === project.id ? 'default' : 'soft'}
          size={isInline ? 'sm' : 'md'}
          onClick={() => store.setSettings({ activeProjectId: project.id })}
        >
          {project.name}
        </Button>
      ))}
    </>
  )

  const tagButtons = (
    <>
      <TagChip
        tag={{ name: 'All', color: '' }}
        active={!store.settings.activeTagIds.length}
        onClick={() => store.setSettings({ activeTagIds: [] })}
      />
      {store.tags.map((tag) => (
        <TagChip
          key={tag.id}
          tag={tag}
          active={store.settings.activeTagIds.includes(tag.id)}
          onClick={() => {
            const has = store.settings.activeTagIds.includes(tag.id)
            store.setSettings({
              activeTagIds: has
                ? store.settings.activeTagIds.filter((id) => id !== tag.id)
                : [...store.settings.activeTagIds, tag.id],
            })
          }}
        />
      ))}
    </>
  )

  if (isInline) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {projectButtons}
        <span className="mx-1 h-4 w-px bg-[var(--hair)]" />
        {tagButtons}
      </div>
    )
  }

  return (
    <div className="w-full">
      {showHeading ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[.1em] text-ink-3">Project</p>
      ) : null}
      <div className="mb-4 grid grid-cols-2 gap-2">{projectButtons}</div>
      {showHeading ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[.1em] text-ink-3">Tags · inclusive OR</p>
      ) : null}
      <div className="flex flex-wrap gap-2">{tagButtons}</div>
    </div>
  )
}
