import { UseSecretary } from "@/context";
import { SubjectGrouped } from "@/models/transactions/subject";
import { CreateActivity, DefaultActivity } from "@/models/types/activity";
import { PersonalData } from "@/models/types/personal-data";
import { Subject } from "@/models/types/subject";
import { getFirstSetValue, InitSelectedKeys } from "@/utils";
import { Accordion, AccordionItem, Card, CardBody, Divider, Select, Selection, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid'

const WorkerSelector = ({ subject, personalData, group, period }: { subject: Subject, personalData: PersonalData[], group: string, period: string }) => {
    const {
        partialTemplateState: { selectedPartialTemplates },
        setStoredPartialTemplates,
    } = UseSecretary()

    const [selectedPeronsalDataKeys, setSelectedPersonalDataKeys] = useState(InitSelectedKeys)
    const handleSelectPersonalData = (e: Selection) => {
        if (e === "all") return
        const selectedPersonalData = personalData.find((personalData) => personalData.ide === Number(getFirstSetValue(e)))
        if (!selectedPersonalData) return
        const newActivity: CreateActivity = {
            ...DefaultActivity,
            activityName: subject.subjectName,
            weeklyHours: subject.weeklyHours,
            subtotalClassification: subject.weeklyHours,
            activityDistribution: 'Docenencia',
            id: uuidv4(),
            gradeGroups: [`${period}${group}`],
        }
        const foundPartialTemplate = selectedPartialTemplates.find((partialTemplate) => partialTemplate.nt === selectedPersonalData.ide)
        if (foundPartialTemplate === undefined) {
            setStoredPartialTemplates({
                selectedPartialTemplates: [
                    ...selectedPartialTemplates,
                    {
                        nt: selectedPersonalData.ide,
                        name: selectedPersonalData.name,
                        position: selectedPersonalData.position,
                        activities: [
                            newActivity
                        ]
                    }
                ]
            })
        } else {
            const isSameName = foundPartialTemplate.activities?.find((activity) => activity.activityName === newActivity.activityName)
            setStoredPartialTemplates({
                selectedPartialTemplates: selectedPartialTemplates.map((partialTemplate) => {
                    if (partialTemplate.nt === selectedPersonalData.ide) {
                        if (isSameName) {
                            return {
                                ...partialTemplate,
                                activities: [
                                    ...(partialTemplate.activities?.map((activity) => {
                                        if (activity.activityName === newActivity.activityName) {
                                            return {
                                                ...activity,
                                                gradeGroups: [
                                                    ...activity.gradeGroups,
                                                    `${period}${group}`
                                                ]
                                            }
                                        }
                                        return activity
                                    }) || []),
                                ]
                            }
                        }
                        return {
                            ...partialTemplate,
                            activities: [
                                ...(partialTemplate.activities || []),
                                newActivity
                            ]
                        }
                    }
                    return partialTemplate
                })
            })
        }
        setSelectedPersonalDataKeys(e)
    }
    return (
        <Select
            isRequired
            size="sm"
            variant="bordered"
            isInvalid={selectedPeronsalDataKeys.size === 0}
            className="w-full sm:w-1/3 md:w-1/3"
            label='Profesor'
            placeholder="Nada seleccionado"
            items={personalData}
            isDisabled={personalData.length === 0}
            selectedKeys={selectedPeronsalDataKeys as Selection}
            onSelectionChange={handleSelectPersonalData}
        >
            {
                (personalData) => {
                    return <SelectItem key={personalData.ide}>{personalData.name}</SelectItem>
                }
            }
        </Select>
    )
}

const SubjectPersonalDataCard = ({ subject, personalData, period }: { subject: Subject, personalData: PersonalData[], period: string }) => {
    const { activityState: { groups } } = UseSecretary()
    return (
        <div className="flex gap-2 flex-col lg:flex-row">
            <Card classNames={{
                base: 'w-full lg:w-1/3',
                body: 'flex justify-center text-sm'
            }}>
                <CardBody>
                    {
                        subject.subjectName
                    }
                </CardBody>
            </Card>
            <div className="flex gap-2 w-full flex-col sm:flex-row">
                {
                    groups.map((group) => {
                        return (
                            <WorkerSelector key={group.id} group={group.name} period={period} subject={subject} personalData={personalData} />
                        )
                    })
                }
            </div>
        </div>
    )
}

const hoverClass = 'hover:cursor-default'

export const PeriodAccordions = ({ subjects, personalData, isDisabled = false }: { personalData: PersonalData[], subjects: SubjectGrouped[], isDisabled?: boolean }) => {
    return (
        <Accordion showDivider={false} selectedKeys='all' isCompact itemClasses={{ heading: hoverClass, title: 'font-bold text-utim ' + hoverClass, titleWrapper: hoverClass, trigger: hoverClass }}>
            {
                subjects.map((subjectGrouped) => {
                    return (
                        <AccordionItem key={subjectGrouped.period} isDisabled={isDisabled} classNames={{
                            content: 'flex flex-col gap-2',
                        }} title={`Cuatrimestre ${subjectGrouped.period}`}>
                            {
                                subjectGrouped.subjects.map(
                                    (subject) => (
                                        <SubjectPersonalDataCard
                                            key={subject.id}
                                            subject={subject}
                                            personalData={personalData}
                                            period={subjectGrouped.period}
                                        />
                                    )
                                )
                            }
                        </AccordionItem>
                    )
                })
            }
        </Accordion>
    )
}