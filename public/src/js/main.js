var _ = require('lodash');
var SearchShop = require('./searchShop.js');
var FormValidator = require('./ppFormValidator.js');

$(document).ready(function() {
	$("#fundMeWizard").steps({
	  headerTag: "h3",
	  bodyTag: "fieldset",
	  transitionEffect: "slideLeft",
    saveState: true,
    titleTemplate: '<span class="monkey">#index#.</span> #title#',
    onStepChanging: function (event, currentIndex, newIndex) {
      var fieldSets = _.keys(formInfo.options.fieldSets);
      var validator = new FormValidator();
      var currentFieldSet = fieldSets[currentIndex];
      var currentFields = formInfo.fields[currentFieldSet];
      validatorResult = validator.validateFields(currentFields);
      console.log(validatorResult);

      /*
      for (var field in currentFields) {
        if (currentFields[field]['widget'] == 'checkbox' || currentFields[field]['widget'] == 'radio') {
          var checked = $('input[name="'+ field +'"]:checked').attr('value');
          valid = !checked ? false : true;
        } else if (currentFields[field]['widget'] == 'text' && $('input[name="'+ field +'"]').attr('required') == 'required') {
          var text = $('input[name="'+ field +'"]').val();
          valid = text === "" ? false : true;
        }
      };
      if (!valid) {
        alert('You have missing fields');
      };
      return valid;*/
    },
    onFinished: function (event, currentIndex) {
      var form = $(this);
      form.submit();
    },
    onFinishing: function (event, currentIndex){
      var valid = true;
      var label = $('fieldset#fundMeWizard-p-'+currentIndex).prev().text();
      var fieldSets = formInfo['options']['fieldSets']
      for (var key in fieldSets) {
        if (fieldSets[key]['label'] == label) {
          var fieldSetName = key;
          break;
        };
      }
      var currentFields = formInfo['fields'][fieldSetName]
      for (var field in currentFields) {
        if (currentFields[field]['widget'] == 'checkbox' || currentFields[field]['widget'] == 'radio') {
          var checked = $('input[name="'+ field +'"]:checked').attr('value');
          valid = !checked ? false : true;
        } else if (currentFields[field]['widget'] == 'text') {
          var text = $('input[name="'+ field +'"]').val();
          valid = text === "" ? false : true;
        }
      };
      if (!valid) {
        alert('You have missing fields');
      };
      return valid;
    }
  });

  $('.delete-model').on('click', function(e){
    var conf = confirm('Are you sure you want to delete this entry?');
    if (!conf) {
      e.preventDefault();
    }
  });

  $('select').each(function(index, sel) {
    if ($(this).attr("multiple") == "multiple") {
      $(this).select2($(this).val());
    } else{
      $(this).select2();
    };
  });

  // For admin page
  $('.choiceOther').hide();
  $('div#eligibleIndustries').next().show();
  $('select').on('change', function() {
    var name = $(this).attr('name');
    if ($('option:selected', this).attr('value') == 'other') {
      $('div#'+ name).next().show();
    };
  });

  // TODO -- will need refactor
  // Look at using backbone statemachine to clean up this whole file.
  $("#fundMeWizard #investingOwnMoney").change(function(event)  {
    var val = $('input[name=investingOwnMoney]:checked', this).attr('value');
    console.log(val);
    if (val == 1)
      $('#fundMeWizard #moneyInvested').show();
    else
      $('#fundMeWizard #moneyInvested').hide();
  });
  $('.model-form').on('submit', function(event) {
    var nameList = [];
    var valid = true;
    $('.select2-choices').each( function(index, elem) {
      if ($(this).children('.select2-search-choice').length == 0) {
        valid = false;
      };
    });

    if (!valid) {
      alert('You have missing fields');
    };

    return valid;
  });

  $('button.array-text-field').click(function(e) {
    var inp = $(this).next().clone().removeAttr('required').val("");
    $(this).parent().append(inp);
  });

  $('input.array-text-field').each(function(index, element) {
    var text = $(this).val().split(',');
    $(this).val(text[0]);
    for (var i = 1; i < text.length; i++) {
      var value = text[i]
      var input = $(this).clone().val(value);
      $(this).parent().append(input);
    };
  });

  // For results page
  if ($('body').hasClass('searchResults')) {
    SearchShop.oppList = new SearchShop.View.OppListView({});
  }
  // For Confirm Page.
  if ($('body').hasClass('confirmPickedResults')) {
    $("#sendRequestForm").steps({
      headerTag: "h3",
      bodyTag: "fieldset",
      transitionEffect: "fade",
      saveState: true,
      titleTemplate: '<span class="monkey">#index#.</span> #title#',
      onFinished: function (event, currentIndex){
        var form = $(this);
        form.submit();
      },
    });
  }

	$("[data-toggle=tooltip]").tooltip();

});
