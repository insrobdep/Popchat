
export interface RavenPushSubscription{
	creation: string
	name: string
	modified: string
	owner: string
	modified_by: string
	docstatus: 0 | 1 | 2
	parent?: string
	parentfield?: string
	parenttype?: string
	idx?: number
	/**	Raven User : Link - Raven User	*/
	user: string
	/**	Subscription Information : JSON	*/
	subscription_info: any
}