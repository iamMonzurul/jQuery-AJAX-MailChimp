# ajaxMailChimp

AjaxMailChimp is a jQuery plugin that lets you ajaxify your mailchimp form with multiple input fields. This plugin is based on [scdoshi's](https://github.com/scdoshi/jquery-ajaxchimp) Mailchimp plugin.

Use this if you hate the jarring transition to the mailchimp website upon submitting an email address to mailchimp.

**Note**: This relies on an undocumented feature at mailchimp that uses JSONP to allow cross-domain ajax to work. You have been warned. (It has however, been around for at least 3 years that I know of, and probably more.)


## Install

Just add the script to your webpage (along with jQuery ofcourse). Get it here:

```
curl -O https://raw.githubusercontent.com/farukham/jQuery-Ajax-MailChimp/master/jquery.ajaxMailChimp.js
```

## Requirements

* jQuery

**Note**: Developed with 1.9.1, but it should work with earlier versions. If it does or does not work with a particular version, please open an issue on github.

## Use

#### On the mailchimp form element

```js
$('form-selector').ajaxMailChimp();
```

## Label

Form should have one label element with attribute id="mc_notification" (used to display error/success message)


#### Example Form

#### Single Field

```html
    <form id="mc-multiple-form">
        <input id="mc_email" type="email" placeholder="email">
        <label id="mc_notification"></label>
        <button type="submit">Submit</button>
    </form>
```

```js
$('#mc-multiple-form').ajaxMailChimp({
    language: 'ft',
    url: '//blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&amp;id=4djhfdsh9',
    fields: {mc_name: "Name", mc_email: "Email", mc_message: "Message"},
    callback: callBackFunction
});
```


#### Multiple Fields

```html
    <form id="mc-form">
        <input id="mc_name" type="text" placeholder="Name">
        <input id="mc_email" type="email" placeholder="email">
        <textarea id="mc_message" placeholder="Message" rows="5"></textarea>
        <label id="mc_notification"></label>
        <button type="submit">Submit</button>
    </form>
```

```js
$('#mc-form').ajaxMailChimp({
    url: 'http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh9'
});
```


## Options


### Fields

You can specify multiple fields to override default email only field.

```js
$('form-selector').ajaxMailChimp({
    fields: {mc_name: "Name", mc_email: "Email", mc_message: "Message"},
});
```
#### Notes

1. For field names always start with 'mc_'
    e.g. 'mc_name', 'mc_email', 'mc_message', 'mc_custom'

2. If you have multiple fields then you have to name your fields according to MailChimp field tags. You can find it
by visiting Settings -> List fields and *|MERGE|* tags in your MailChimp list.
For e.g if have a custom field "Subject" then your field tag name should be "SUBJECT" (all CAPS) in MailChimp and in your form input field name as "mc_subject".


### Callback

Optionally, you can specify a callback with either method to run after the
ajax query to mailchimp succeeds or fails.

```js
$('form-selector').ajaxMailChimp({
    callback: callbackFunction
});
```

The JSONP response from mailchimp will be passed to the callback function

```js
function callbackFunction (resp) {
    if (resp.result === 'success') {
        // Do stuff
    }
}
```

### URL

You can specify the mailchimp URL to post to (or override the url provided on the form element)

```js
$('form-selector').ajaxMailChimp({
    url: 'mailchimp-post-url'
});
```

The mailchimp post url will look like this:

```
http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f
```

### Language Support

For success and error messages in different languages:

- Specify the language as an option.


```js
$('form-selector').ajaxMailChimp({
    language: 'en'
});
```

**Note**: If the language you want is not supported out of the box, or the translations are wrong, open a pull request with the required language and I will add it in.

You can also add custom translations just for your website:

```js
$.ajaxMailChimp.translations.es = {
    'submit': 'Grabación en curso...',
    0: 'Te hemos enviado un email de confirmación',
    1: 'Por favor, introduzca un valor',
    2: 'Una dirección de correo electrónico debe contener una sola @',
    3: 'La parte de dominio de la dirección de correo electrónico no es válida (la parte después de la @:)',
    4: 'La parte de usuario de la dirección de correo electrónico no es válida (la parte antes de la @:)',
    5: 'Esta dirección de correo electrónico se ve falso o no válido. Por favor, introduce una dirección de correo electrónico real'
}
```

The mapping to english for mailchimp responses and the submit message are as follows:

```js
    // Submit Message
    // 'submit': 'Submitting...'

    // Mailchimp Responses
    // 0: 'We have sent you a confirmation email'
    // 1: 'Please enter a value'
    // 2: 'An email address must contain a single @'
    // 3: 'The domain portion of the email address is invalid (the portion after the @: )'
    // 4: 'The username portion of the email address is invalid (the portion before the @: )'
    // 5: 'This email address looks fake or invalid. Please enter a real email address'

```

