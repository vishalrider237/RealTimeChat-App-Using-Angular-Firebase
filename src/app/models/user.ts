export class User{
    constructor(
        public uid:string='',
        public email:string='',
        public password:string='',
        public displayName='',
        public imageURL:string='',
        public emailVerified:boolean=false,
        public name:string='',
        public about:string='',

    ){

    }
}