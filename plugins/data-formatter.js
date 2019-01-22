import Jsona from 'jsona'

export default (ctx, inject ) => {
	const dataFormatter = new Jsona()
	//ctx.$dataFormatter = dataFormatter
	inject('dataFormatter', dataFormatter)
}
