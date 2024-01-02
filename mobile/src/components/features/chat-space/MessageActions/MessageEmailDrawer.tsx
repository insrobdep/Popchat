import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonTitle, IonToolbar } from '@ionic/react'
import { useFrappePostCall } from 'frappe-react-sdk'
import React, { useRef } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { IoArrowUpCircleOutline } from 'react-icons/io5'
import { MessageBlock } from '../../../../../../types/Messaging/Message'

export type Email = {
    recipients: string,
    cc?: string,
    bcc?: string,
    subject: string,
    content: string,
    doctype: string,
    name: string,
    send_me_a_copy: 1 | 0,
    read_receipt: 1 | 0,
    send_email: 1 | 0,
    print_html: 1 | 0,
    print_format: string,
    email_template: string,
    attachments: File[],
    _lang: string,
    print_letterhead: 1 | 0,
    id: string,
    doc: any,
}

interface EmailDrawerProps {
    isOpen: boolean,
    onDismiss: VoidFunction,
    message: MessageBlock,
    onSuccess: VoidFunction
}

export const MessageEmailDrawer = ({ isOpen, onDismiss, message, onSuccess }: EmailDrawerProps) => {

    const { call, error } = useFrappePostCall<{ message: string[] }>('frappe.core.doctype.communication.email.make')

    const modal = useRef<HTMLIonModalElement>(null)
    console.log(message)
    const methods = useForm<Email>()
    const { register, reset, watch, handleSubmit } = methods

    const onSubmit = (data: Email) => {

        call({
            recipients: data.recipients,
            subject: data.subject,
            content: data.content,
            doctype: data.doctype,
            name: data.name,
            send_me_a_copy: data.send_me_a_copy,
            read_receipt: data.read_receipt,
            send_email: 1,
            print_html: data.print_html,
            print_format: 'Standard',
            _lang: data._lang,
            print_letterhead: 1,
        }).then(res => {
            reset()
            onDismiss()
            onSuccess()
        })
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <IonModal
                    ref={modal}
                    isOpen={isOpen}
                    onDidDismiss={onDismiss}
                    initialBreakpoint={0.95}
                >
                    <IonHeader>
                        <IonToolbar>
                            <IonButton slot='start' onClick={onDismiss} fill='clear'>Cancel</IonButton>
                            <IonTitle>{watch('subject') ?? "New Message"}</IonTitle>
                            <IonButton slot='end' fill='clear' type='submit'><IoArrowUpCircleOutline fontSize='25px' /></IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <EmailForm message={message} />
                    </IonContent>
                </IonModal>
            </form>
        </FormProvider>
    )
}

const EmailForm = ({ message }: { message: MessageBlock }) => {

    const { register } = useFormContext()

    return (
        <IonList lines='full'>
            <IonItem>
                <IonLabel>To</IonLabel>
                <IonInput {...register('recipients')} clearInput />
            </IonItem>
            <IonItem>
                <IonLabel>Subject</IonLabel>
                <IonInput {...register('subject')} clearInput />
            </IonItem>
            <IonItem>
                
            </IonItem>
        </IonList>
    )
}