import history from '../history';
import { toast } from 'react-toastify';

export default class NavigationUtil {
  static notFoundAlert = () => {
    toast.error('Trang bạn tìm kiếm không tồn tại');
    history.goBack();
  }
}
