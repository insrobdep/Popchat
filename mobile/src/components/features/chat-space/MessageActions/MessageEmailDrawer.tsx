import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonText, IonTitle, IonToolbar } from '@ionic/react'
import { useFrappePostCall } from 'frappe-react-sdk'
import React, { useRef } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { IoArrowUpCircleOutline } from 'react-icons/io5'
import { MessageBlock, TextMessage } from '../../../../../../types/Messaging/Message'
import { EmailEditor } from './EmailEditor'

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

        console.log(data)
        // call({
        //     recipients: data.recipients,
        //     subject: data.subject,
        //     content: data.content,
        //     doctype: data.doctype,
        //     name: data.name,
        //     send_me_a_copy: data.send_me_a_copy,
        //     read_receipt: data.read_receipt,
        //     send_email: 1,
        //     print_html: data.print_html,
        //     print_format: 'Standard',
        //     _lang: data._lang,
        //     print_letterhead: 1,
        // }).then(res => {
        //     reset()
        //     onDismiss()
        //     onSuccess()
        // })
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <IonModal
                    ref={modal}
                    isOpen={isOpen}
                    // onWillDismiss={onDismiss}
                    onDidDismiss={modal.current?.dismiss}
                    initialBreakpoint={0.95}
                >
                    <IonHeader>
                        <IonToolbar>
                            <IonButton slot='start' className='p-0' onClick={() => modal.current?.dismiss()} fill='clear'>Cancel</IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <div className='flex items-center justify-between ps-4'>
                            <IonText class='text-xl font-semibold'>{watch('subject') ?? "New Message"}</IonText>
                            <IonButton fill='clear' type='submit' onClick={handleSubmit(onSubmit)}><IoArrowUpCircleOutline fontSize='25px' /></IonButton>
                        </div>
                        <EmailForm message={message} loading={false} onDismiss={onDismiss}/>
                    </IonContent>
                </IonModal>
            </form>
        </FormProvider>
    )
}

const EmailForm = ({ message, loading, onDismiss }: { message: MessageBlock, loading: boolean, onDismiss: VoidFunction }) => {

    const { register, watch } = useFormContext()
    
    const data = message.data as TextMessage

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
            <IonButton onClick={onDismiss}>Close</IonButton>
            <IonItem>
                <EmailEditor messageSending={loading} defaultText={data?.text ?? ''} />
            </IonItem>
        </IonList>
    )
}