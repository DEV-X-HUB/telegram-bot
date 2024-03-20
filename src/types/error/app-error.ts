class AppError extends Error {
    statusCode : number;
    isOperational :boolean;
    constructor(statusCode:number,message:string,isOperational:boolean=true,stack:string=''){
        super(message);
        if(stack){
            this.stack =  stack;
        }else {
            Error.captureStackTrace(this,this.constructor);

        }
        this.statusCode =  statusCode;
        this.isOperational=isOperational;

    }
}


export default AppError