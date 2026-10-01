import { Link } from 'react-router-dom';

export default function AppLink({ children, ...props }) {
  return <Link viewTransition {...props}>{children}</Link>;
}
