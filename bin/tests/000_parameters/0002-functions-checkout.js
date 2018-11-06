/* Return 1D array from multiple dimensional array */

casper.test.begin('Functions Checkout', function (test) {

    /* Fill Step Payment */
    casper.fillStepPayment = function (hostedFields) {
        this.echo("Choosing payment method and filling 'Payment Information' formular with " + currentBrandCC + "...", "INFO");
        this.waitUntilVisible('#checkout-step-payment', function success() {
            var method_hipay = "method_hipay_cc";

            if (hostedFields) {
                method_hipay = "method_hipay_hostedfields";
            }

            if (this.visible('p[class="bugs"]')) {
                this.click('input#p_' + method_hipay);
            } else {
                this.click('#dt_' + method_hipay + '>input[name="payment[method]"]');
            }

            if (currentBrandCC == 'visa') {
                this.fillFormMagentoCreditCard(cardsType.visa, cardsNumber.visa, "500", hostedFields);
            } else if (currentBrandCC == 'cb' || currentBrandCC == "mastercard") {
                this.fillFormMagentoCreditCard(cardsType.cb, cardsNumber.cb, "500", hostedFields);
            } else if (currentBrandCC == 'amex') {
                this.fillFormMagentoCreditCard(cardsType.amex, cardsNumber.amex, "500", hostedFields);
            } else if (currentBrandCC == 'visa_3ds') {
                this.fillFormMagentoCreditCard(cardsType.visa, cardsNumber.visa_3ds, "500", hostedFields);
            } else if (currentBrandCC == 'maestro') {
                this.fillFormMagentoCreditCard(cardsType.maestro, cardsNumber.maestro, "", hostedFields);
            }
            this.wait(10000, function () {
                this.click("div#payment-buttons-container>button");
            });
            test.info("Done");
        }, function fail() {
            test.assertVisible("#checkout-step-payment", "'Payment Information' formular exists");
            test.info("Initial credential for api_user_name was :" + initialCredential);
            this.fillFormHipayEnterprise(initialCredential);
            test.assertVisible("#checkout-step-payment", "'Payment Information' formular exists");
        }, 15000);
    };

    /* Fill HiPayCC formular */
    casper.fillFormMagentoCreditCard = function (type, card, cvv, hostedFields) {
        if (hostedFields) {
            casper.withFrame(2, function () {
                casper.sendKeys('input[name="cardnumber"]', card);
            });
            casper.withFrame(3, function () {
                casper.sendKeys('input[name="cc-exp"]', '06/21');
            });
            casper.withFrame(4, function () {
                casper.sendKeys('input[name="cvc"]', cvv);
            });
        } else {
            this.fillSelectors('form#co-payment-form', {
                'select[name="payment[hipay_cc_cc_type]"]': type,
                'input[name="payment[hipay_cc_cc_number]"]': card,
                'select[name="payment[hipay_cc_cc_exp_month]"]': '2',
                'select[name="payment[hipay_cc_cc_exp_year]"]': '2020',
                'input[name="payment[hipay_cc_cc_cid]"]': cvv
            }, false);
        }
    };

    /**
     *  Select payment method in magento checkout
     *
     * @param method_hipay
     */
    casper.choosingPaymentMethod = function (method_hipay) {
        this.echo("Choosing payment method with " + method_hipay, "INFO");
        this.waitUntilVisible('#checkout-step-payment div#payment-buttons-container>button', function success() {
            if (this.visible('p[class="bugs"]')) {
                this.click('input#p_' + method_hipay);
            } else {
                this.click('#dt_' + method_hipay + '>input[name="payment[method]"]');
            }
            this.click("div#payment-buttons-container>button");
            test.info("Done");
        }, function fail() {
            test.assertVisible("#checkout-step-payment", "'Payment Information' formular exists");
        }, 25000);
    }


    casper.echo('Functions checkout loaded !', 'INFO');
    test.done();
});
