import { Accordion, AccordionItem, Badge, BreadcrumbItem, Breadcrumbs, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { HorizontalDostIcon, StackIcon } from "./Icons"
import { UseTemplates } from "../context"
import { ActivityCard } from "./Activity"
import { EducationalProgram } from "../models/types/educational-program"

export const AcademicCharge = ({ educationalPrograms }: { educationalPrograms: EducationalProgram[] }) => {
    const { memory: { activities, selectedActivity }, setStored } = UseTemplates()
    return (
        <Accordion aria-label="Academic Details" showDivider={false} isCompact fullWidth selectionMode="multiple">
            <AccordionItem
                classNames={{
                    subtitle: 'text-sm text-utim font-semibold tracking-wider',
                }}
                aria-label="Academic Charge"
                title='Carga académica'
                subtitle="selecciona actividades académicas"
                startContent={
                    <Badge
                        color="primary"
                        content={activities.length}
                    >
                        {StackIcon}
                    </Badge>
                }
            >
                <Breadcrumbs
                    variant="light"
                    itemsBeforeCollapse={1}
                    itemsAfterCollapse={2}
                    separator={','}
                    classNames={{
                        list: "gap-2",
                    }}
                    itemClasses={{
                        separator: "hidden",
                    }}
                    renderEllipsis={
                        ({ items, ellipsisIcon, separator }) => {
                            return (
                                <Dropdown className="grid min-w-[10]" aria-label="Item Selector">
                                    <DropdownTrigger aria-label="Dropdown Button">
                                        <Button
                                            isIconOnly
                                            color={
                                                items.some(e => e.accessKey === selectedActivity.id) ? 'primary' : 'default'
                                            }
                                            className="min-w-unit-6 w-unit-6 h-unit-6" size="sm"
                                            variant="solid"
                                        >
                                            {ellipsisIcon}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        variant="solid"
                                        className="m-0"
                                        key={'DropdownSelectItem'}
                                        aria-label="Dropdown actividades"
                                        items={items}
                                    >
                                        {
                                            (item) => {
                                                return (
                                                    <DropdownItem
                                                        key={item.accessKey}
                                                        className="p-0 my-1 w-full grid"
                                                        color="primary"
                                                        aria-label={`Select act ${item.accessKey}`}
                                                    >
                                                        {item.children}
                                                    </DropdownItem>
                                                )
                                            }
                                        }
                                    </DropdownMenu>
                                </Dropdown>
                            )
                        }
                    }
                >
                    {
                        activities.map(({ id }, i) => {
                            return (
                                <BreadcrumbItem key={id} accessKey={id} isCurrent={id === selectedActivity.id}>
                                    <Chip
                                        size="sm"
                                        key={id}
                                        accessKey={id}
                                        onClick={() => {
                                            setStored({ selectedActivity: activities.find(activity => activity.id === id) })
                                        }}
                                        color={id === selectedActivity.id ? 'primary' : 'default'}
                                    >
                                        {
                                            `Actividad ${i + 1}`
                                        }
                                    </Chip>
                                </BreadcrumbItem>
                            )
                        })
                    }
                </Breadcrumbs>
            </AccordionItem>
            <AccordionItem
                aria-label="Activity Details"
                startContent={HorizontalDostIcon}
                title='Detalles de carga académica'
            >
                <ActivityCard activity={selectedActivity} educationalPrograms={educationalPrograms} key={selectedActivity.id} />
            </AccordionItem>
        </Accordion>
    )
}
