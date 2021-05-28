// Apply IP version reqex to host input.
function applyIPVersionRegex(value) {
  switch (value) {
    case "IPv4":
      $('#hostname').attr('pattern', domainRegex + "|" + ipv4Regex)
      break;

    case "IPv6":
      $('#hostname').attr('pattern', domainRegex + "|" + ipv6Regex)
      break;

    case "IPvDefault":
      $('#hostname').attr('pattern', domainRegex + "|" + ipv4Regex + "|" + ipv6Regex)
      break;
    default:
      console.log("applyIPVersionRegex: Unexpected value")
  }
}

// Select All Options automatically.
function autoSelectOptions() {
  $(".autoSelected").each(function () {
    //console.log($(this).attr('name'), $(this).val())
    if ($(this).val() == null) {
      //console.log("null best val", $(this).find("option").not('[disabled]').first().val())
      $(this).val($(this).find("option").not('[disabled]').first().val());
    } else {
      if (currentServerConfig[$(this).val()] != "enabled") {
        //console.log("this settings is disabled for " + $(this).attr('name') + $(this).val())
        $(this).find("option:selected").each(function () { $(this).removeAttr('selected'); });
        $(this).val($(this).find("option").not('[disabled]').first().val());
      }
    }
  });

  // After select all options automatically check requirements.
  hasARequirement()
}

// Look to requirements.
function hasARequirement() {
  $(".hasARequirement").find("option:selected").each(function () {
    if ($(this).attr("hasIPVersion") == "yes") {
      applyIPVersionRegex($("#IPVersion").show().val())
    } else {
      $("#IPVersion").hide();
      applyIPVersionRegex("IPvDefault")
    }
    if ($(this).attr("hasreqScheme") == "yes") {
      $("#reqScheme").show();
    } else {
      $("#reqScheme").hide();
    }
  });
}


// Is mobile ?
function isMobile() {
  if ($(window).width() > '991') {
    return false;
  } else {
    return true;
  }
}

// Iframe RUN
function lgIframeRun() {
  var svURL = $("#" + localStorage.SelectedServerID).data("svjson")["Url"];
  // Check if server is selected or not. If not show server select modal
  if (svURL && svURL != "") {
    $("#loadingCircle").show();
    $('#runButton').prop('disabled', true); // Deactive form to prevent many request.
    $("#funcCard").show()
    $('#funcFrame').attr('src', svURL + "/looking-glass-controller" + "?" + $("#lg_run_form").serialize())
  } else {
    $('#serverSelectModal').modal('toggle')
  }
  // Active button.
  setTimeout(() => { $('#runButton').prop('disabled', false); }, 1200);
}

function svTableFill(objId) {
  $("#pageDescr").hide()
  $(".svDescr").show()
  $(".serverLocation").html($(objId).data("svloc"))
  var svjson = $(objId).data("svjson")
  var svInfos = ['Description', 'IPV4Address', 'IPV6Address', "ASN"];
  svInfos.forEach(function (item) {
    if (svjson[item] != null && svjson[item] != "") {
      $(".server" + item).html(svjson[item])
    } else {
      $(".server" + item).html("")//∅
    }
  });
  var svInfos = ['ping', 'tracert', 'nslookup', "curl", "whois"];
  var tempArr = [];
  svInfos.forEach(function (item) {
    if (currentServerConfig[item] == "enabled") {
      tempArr.push(item)
    }
  });
  var tempString = ""
  for (item2 in tempArr) {
    if (tempString == "") {
      tempString = tempArr[item2]
    } else {
      tempString = tempString + "," + tempArr[item2]
    }
  }
  $(".serverServices").html(tempString)
}


$(document).ready(function () {
  //When the document ready start services.
  if (isMobile()) {
    $("#isMobile").val("1");
  }

  $(".hasARequirement").change(function () {
    hasARequirement()
  }).change();


  $("#IPVersion").change(function () {
    applyIPVersionRegex($(this).val())
  }).change();

  $("#funcFrame").on("load", function () {
    $("#loadingCircle").hide()
  });

});