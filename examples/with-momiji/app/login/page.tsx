import SocialLogin from './social-login';
import EmailForm from './email-form';

export default function LoginPage() {
  console.log('server login page');
  return (
    <main>
      <section>
        <SocialLogin />
      </section>
      <section>
        <EmailForm />
      </section>
      <section>Terms and Conditions</section>
    </main>
  );
}
