const stripe = Stripe(
  'pk_test_51MkqFBDodz8EKO4rlyMDMwAsvKlBNFoTIU2zwWkrsQu7UrMdEbtj6Jh76TVVG2BDTE5lkOgJ9dO5SoAjvKpvrtmq00RnGmZtZa'
);
const orderButton = document.getElementById('order-btn');
orderButton.addEventListener('click', () => {
  stripe
    .redirectToCheckout({
      sessionId: orderButton.dataset.sessionId,
    })
    .then((result) => {
      console.log(result.error.message);
    });
});
