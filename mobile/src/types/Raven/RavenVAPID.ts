
export interface RavenVAPID{
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
	/**	Public Key : Data	*/
	public_key: string
	/**	Private Key : Password	*/
	private_key: string
	/**	Subject : Data	*/
	subject: string
}