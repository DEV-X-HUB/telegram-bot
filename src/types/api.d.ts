interface BareResponse {
  status: 'success' | 'fail';
  message: string;
}
interface ResponseWithData extends BareResponse {
  data: null | any;
}
