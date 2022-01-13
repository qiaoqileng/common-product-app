import request from "@/uview-ui/libs/request/index.js"
import { PAGE_SIZE } from "@/utils/config.js"

export function processTaskList(params={}){
	return request.get(`/api/workflow/${params.page}/${params.pageSize || PAGE_SIZE}/processTaskList`)
}