/*!
 AJAX Mailchimp with Multiple Fields
 jQuery Plugin
 Author: Monzurul Haque

 Use:
 ===
 $('#form_id').ajaxMailChimp(options);

 - Form should have at least one <input> element with attribute id="mc_email"
 - Multiple form inputs allowed.
 - Form should have one label element with attribute id="mc_notification" (used to display error/success message)
 - All options are optional.

 Options:
 =======
 options = {
 language: 'en',
 fields: {mc_name: "Name", mc_email: "Email", mc_message: "Message"},
 callback: callbackFunction,
 url: 'http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f'
 }

 Notes:
 =====
 1. For field names always start with 'mc_'
    e.g. 'mc_name', 'mc_email', 'mc_message', 'mc_custom'

 2. If you have multiple fields then you have to name your fields according to MailChimp field tags. You can find it
    by visiting Settings -> List fields and *|MERGE|* tags in your MailChimp list.
    For e.g if have a custom field "Subject" then your field tag name should be "SUBJECT" (all CAPS) in MailChimp and
    in your form input field name as "mc_subject".

 3. To get the mailchimp JSONP url (undocumented), change 'post?' to 'post-json?' and add '&c=?' to the end.
    For e.g. 'http://blahblah.us1.list-manage.com/subscribe/post-json?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f&c=?',
 */

(function ($) {

    $.ajaxMailChimp = {
        responses: {
            'We have sent you a confirmation email'                                             : 0,
            'Please enter a value'                                                              : 1,
            'An email address must contain a single @'                                          : 2,
            'The domain portion of the email address is invalid (the portion after the @: )'    : 3,
            'The username portion of the email address is invalid (the portion before the @: )' : 4,
            'This email address looks fake or invalid. Please enter a real email address'       : 5
        },
        translations: {
            'en': null
        },
        init: function (selector, options) {
            $(selector).ajaxMailChimp(options);
        }
    };

    $.fn.ajaxMailChimp = function (options) {
        $(this).each(function(i, elem) {
            var form = $(elem);

            //Form default settings
            var settings = $.extend({
                'url': form.attr('action'),
                'fields': {mc_email: "Email"},
                'language': 'en'
            }, options);

            var formFields = settings.fields;

            //Dynamic form element selection and attribute generation
            for (var name in formFields) {
                this[name] = formFields[name];
                var idName = '#'+name;
                var fieldId = form.find(idName);
                var fieldName = name.split("_").pop().toUpperCase();
                fieldId.attr('name', fieldName);
            }

            //Selecting notification element
            var label = form.find('#mc_notification');

            var url = settings.url.replace('/post?', '/post-json?').concat('&c=?');

            form.attr('novalidate', 'true');

            form.submit(function () {
                var msg;
                function successCallback(resp) {
                    if (resp.result === 'success') {
                        msg = 'We have sent you a confirmation email';
                        label.removeClass('error').addClass('valid');
                    } else {
                        label.removeClass('valid').addClass('error');
                        var index = -1;
                        try {
                            var parts = resp.msg.split(' - ', 2);
                            if (parts[1] === undefined) {
                                msg = resp.msg;
                            } else {
                                var i = parseInt(parts[0], 10);
                                if (i.toString() === parts[0]) {
                                    index = parts[0];
                                    msg = parts[1];
                                } else {
                                    index = -1;
                                    msg = resp.msg;
                                }
                            }
                        }
                        catch (e) {
                            index = -1;
                            msg = resp.msg;
                        }
                    }

                    // Translate and display message
                    if (
                        settings.language !== 'en'
                        && $.ajaxMailChimp.responses[msg] !== undefined
                        && $.ajaxMailChimp.translations
                        && $.ajaxMailChimp.translations[settings.language]
                        && $.ajaxMailChimp.translations[settings.language][$.ajaxMailChimp.responses[msg]]
                    ) {
                        msg = $.ajaxMailChimp.translations[settings.language][$.ajaxMailChimp.responses[msg]];
                    }
                    label.html(msg);

                    label.show(2000);
                    if (settings.callback) {
                        settings.callback(resp);
                    }
                }

                var data = {};
                var dataArray = form.serializeArray();
                $.each(dataArray, function (index, item) {
                    data[item.name] = item.value;
                });

                $.ajax({
                    url: url,
                    data: data,
                    success: successCallback,
                    dataType: 'jsonp',
                    error: function (resp, text) {
                        console.log('mailchimp ajax submit error: ' + text);
                    }
                });

                // Translate and display submit message
                var submitMsg = 'Submitting...';
                if(
                    settings.language !== 'en'
                    && $.ajaxMailChimp.translations
                    && $.ajaxMailChimp.translations[settings.language]
                    && $.ajaxMailChimp.translations[settings.language]['submit']
                ) {
                    submitMsg = $.ajaxMailChimp.translations[settings.language]['submit'];
                }
                label.html(submitMsg).show(2000);

                return false;
            });
        });
        return this;
    };
})(jQuery);

