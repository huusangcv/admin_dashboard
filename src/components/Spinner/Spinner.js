import { LiaSpinnerSolid } from 'react-icons/lia';
import styles from './Spinner.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Spinner = () => {
  return <LiaSpinnerSolid className={cx('loader-icon')} />;
};

export default Spinner;
