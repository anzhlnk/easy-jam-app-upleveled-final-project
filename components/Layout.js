import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
  return (
    <div>
      <Header
        user={props.user}
        profileImage={props.profileImage}
        refreshUserProfile={props.refreshUserProfile}
      />
      {props.children}
      <Footer user={props.user} />
    </div>
  );
}
