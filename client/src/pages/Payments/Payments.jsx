import { useMutation } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import { CREATE_CHECKOUT_URL, CANCEL_SUBSCRIPTION } from '../../graphql/mutations';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import styles from './Payments.module.scss';

// TODO: Replace with your actual Lemon Squeezy variant IDs
const PLANS = [
  {
    name: 'Starter',
    price: '$9/mo',
    variantId: 'VARIANT_ID_STARTER',
    features: ['Feature placeholder 1', 'Feature placeholder 2', 'Feature placeholder 3'],
  },
  {
    name: 'Pro',
    price: '$29/mo',
    variantId: 'VARIANT_ID_PRO',
    features: ['Everything in Starter', 'Feature placeholder 4', 'Feature placeholder 5', 'Feature placeholder 6'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99/mo',
    variantId: 'VARIANT_ID_ENTERPRISE',
    features: ['Everything in Pro', 'Feature placeholder 7', 'Feature placeholder 8', 'Priority support'],
  },
];

export default function Payments() {
  const { user, isAuthenticated } = useAuth();

  const [checkout, { loading: checkoutLoading }] = useMutation(CREATE_CHECKOUT_URL, {
    onCompleted({ createCheckoutUrl }) {
      window.location.href = createCheckoutUrl;
    },
  });

  const [cancel, { loading: cancelLoading }] = useMutation(CANCEL_SUBSCRIPTION);

  const activePlan = user?.subscription?.status === 'active';

  function handleCheckout(variantId) {
    if (!isAuthenticated) {
      window.location.href = '/register';
      return;
    }
    checkout({ variables: { variantId } });
  }

  return (
    <div className={styles.page}>
      <h1>Pricing</h1>
      <p className={styles.subtitle}>Choose the plan that works for you.</p>

      <div className={styles.grid}>
        {PLANS.map((plan) => (
          <Card key={plan.name} className={`${styles.plan} ${plan.popular ? styles.popular : ''}`}>
            {plan.popular && <span className={styles.badge}>Most Popular</span>}
            <h3>{plan.name}</h3>
            <p className={styles.price}>{plan.price}</p>
            <ul className={styles.features}>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Button
              size="lg"
              variant={plan.popular ? 'primary' : 'secondary'}
              onClick={() => handleCheckout(plan.variantId)}
              disabled={checkoutLoading}
            >
              {activePlan ? 'Change Plan' : 'Get Started'}
            </Button>
          </Card>
        ))}
      </div>

      {activePlan && (
        <div className={styles.manage}>
          <p>
            Current plan: <strong>{user.subscription.plan}</strong>
          </p>
          <Button variant="danger" size="sm" onClick={() => cancel()} disabled={cancelLoading}>
            Cancel Subscription
          </Button>
        </div>
      )}
    </div>
  );
}
