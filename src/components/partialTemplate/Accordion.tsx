import { SubjectGrouped } from "@/models/transactions/subject";
import { PersonalData } from "@/models/types/personal-data";
import { Subject } from "@/models/types/subject";
import { InitSelectedKeys } from "@/utils";
import { Accordion, AccordionItem, Card, CardBody, Select, Selection, SelectItem } from "@nextui-org/react";
import { useState } from "react";

const SubjectPersonalDataCard = ({ subject, personalData }: { subject: Subject, personalData: PersonalData[] }) => {
    const [selectedPeronsalDataKeys, setSelectedPersonalDataKeys] = useState(InitSelectedKeys)
    const handleSelectPersonalData = (e: Selection) => {
        if (e === "all") return
        setSelectedPersonalDataKeys(e)
    }
    return (
        <div className="flex gap-2 flex-col sm:flex-row">
            <Card classNames={{
                base: 'w-full sm:w-1/2',
                body: 'flex justify-center text-sm'
            }}>
                <CardBody>
                    {
                        subject.subjectName
                    }
                </CardBody>
            </Card>
            <Select
                isRequired
                variant="bordered"
                isInvalid={selectedPeronsalDataKeys.size === 0}
                className="w-full sm:w-1/2"
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
        </div>
    )
}


export const PeriodAccordions = ({ subjects, personalData, isDisabled = false }: { personalData: PersonalData[], subjects: SubjectGrouped[], isDisabled?: boolean }) => {
    return (
        <Accordion>
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