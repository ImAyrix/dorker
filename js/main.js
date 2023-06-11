$(function() {

  $('.js-check-all').on('click', function() {

  	if ( $(this).prop('checked') ) {
	  	$('th input[type="checkbox"]').each(function() {
	  		$(this).prop('checked', true);
        $(this).closest('tr').addClass('active');
	  	})
  	} else {
  		$('th input[type="checkbox"]').each(function() {
	  		$(this).prop('checked', false);
        $(this).closest('tr').removeClass('active');
	  	})
  	}

  });

  $('th[scope="row"] input[type="checkbox"]').on('click', function() {
    if ( $(this).closest('tr').hasClass('active') ) {
      $(this).closest('tr').removeClass('active');
    } else {
      $(this).closest('tr').addClass('active');
    }
  });
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has('q')) {
    const domainsString = urlParams.get('q');
    const domainsArray = domainsString.split(",");
    let count = 1000;
    for (let domain of domainsArray) {
        let google = googleDorks(domain.trim());
        let index = 0;
        for (let gDorks of google){
            addRow(count, domain, googleDorksHelp()[index], gDorks.substring(0, 80) + "...", "Google", "https://www.google.com/search?q=" + encodeURIComponent(gDorks));
            index++;
            count++;
        }

        index = 0;
        let github = githubDorks(domain.trim());
        for (let gDorks of github){
            addRow(count, domain, githubDorksHelp()[index], gDorks.substring(0, 80) + "...", "Github", "https://github.com/search?q=" + encodeURIComponent(gDorks));
            index++;
            count++;
        }

    }
}

function googleDorks(domain){
    return [
        'site:' + domain + ' inurl:&',
        'site:' + domain + ' ext:php | ext:aspx | ext:asp | ext:jsp | ext:html | ext:htm',
        'site:' + domain + ' ext:log | ext:txt | ext:conf | ext:cnf | ext:ini | ext:env | ext:sh | ext:bak | ext:backup | ext:swp | ext:old | ext:~ | ext:git | ext:svn | ext:htpasswd | ext:htaccess | ext:xml',
        'site:' + domain + ' inurl:url= | inurl:return= | inurl:next= | inurl:redir= inurl:http',
        'site:' + domain + ' inurl:http | inurl:url= | inurl:path= | inurl:dest= | inurl:html= | inurl:data= | inurl:domain= | inurl:page= inurl:&',
        'site:' + domain + ' inurl:config | inurl:env | inurl:setting | inurl:backup | inurl:admin | inurl:php',
        'site:' + domain + ' inurl:email= | inurl:phone= | inurl:password= | inurl:secret= inurl:&',
        'site:' + domain + ' inurl:apidocs | inurl:api-docs | inurl:swagger | inurl:api-explorer',
        'site:' + domain + ' inurl:cmd | inurl:exec= | inurl:query= | inurl:code= | inurl:do= | inurl:run= | inurl:read= | inurl:ping= inurl:&',
        'site:' + domain + ' inurl:(unsubscribe|register|feedback|signup|join|contact|profile|user|comment|api|developer|affiliate|upload|mobile|upgrade|password)',
        'site:' + domain + ' intitle:"Welcome to Nginx"',
        'site:http://ideone.com | site:http://codebeautify.org | site:http://codeshare.io | site:http://codepen.io | site:http://repl.it | site:http://justpaste.it | site:http://pastebin.com | site:http://jsfiddle.net | site:http://trello.com' + ` "${domain}"`,
        'site:groups.google.com' + ` "${domain}"`,
        'site:docs.google.com/spreadsheets' + ` "${domain}"`,
        'site:' + domain + ' ext:pdf intext:confidential',
    ];
}

function googleDorksHelp(){
    return [
        "URLs with parameters",
        "URLs with (php|aspx|asp|jsp|html|htm) extensions",
        "URLs with (log|txt|conf|cnf|ini|enc) and etc extensions",
        "URLs with parameters for SSRF and Open Redirect",
        "URLs with parameters for SSRF and Open Redirect 2",
        "URLS with config words",
        "URLs with secrets words",
        "URLs with API words",
        "URLs with CI words",
        "URLs with (register|login|join) and etc words",
        "Default Nginx Page",
        "Search in third parties",
        "Search in Google groups",
        "Search in Google docs",
        "Search confidentials in pdf files",
    ]
}

function githubDorks(domain){
    return [
        `("${domain}") AND ("pwd" OR "ftp" OR "dotfiles" OR "JDBC" OR "key-keys" OR "send_key-keys" OR "send,key-keys" OR "token" OR "user" OR "login-singin")`,
        `("${domain}") AND ("passkey-passkeys" OR "pass" OR "secret" OR "SecretAccessKey" OR "app_AWS_SECRET_ACCESS_KEY AWS_SECRET_ACCESS_KEY")`,
        `("${domain}") AND  ("credentials" OR "config" OR "security_credentials" OR "connectionstring" OR "ssh2_auth_password" OR "DB_PASSWORD")`
    ]
}

function githubDorksHelp(){
    return [
        `Github Dork 1`,
        `Github Dork 2`,
        `Github Dork 3`,
    ]
}

function addRow(id, domain, description, descriptionFull, platform, link){
    let tbody = document.getElementById("tbody-main");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let label = document.createElement("label");
    let input = document.createElement("input");
    let div = document.createElement("div");
    let link_domain = document.createElement("a");
    let link_dork = document.createElement("a");
    let small = document.createElement("small");

    tr.setAttribute("scope", "row");
    th.setAttribute("scope", "row");
    label.setAttribute("class", "control control--checkbox");
    input.setAttribute("type", "checkbox");
    div.setAttribute("class", "control__indicator");
    link_domain.setAttribute("href", `https://${domain}`);
    small.setAttribute("class", "d-block");
    link_dork.setAttribute("href", link);
    link_dork.setAttribute("target", "_blank")

    label.append(input);
    label.append(div);
    th.append(label)

    let td_id = document.createElement("td");
    let td_domain = document.createElement("td");
    let td_desc = document.createElement("td");
    let td_platform = document.createElement("td");
    let td_link = document.createElement("td");

    td_id.innerText = id;
    link_domain.innerText = domain;
    link_dork.innerText = "Click Me";
    td_domain.append(link_domain);
    td_desc.append(description);
    small.innerText = descriptionFull;
    td_desc.append(small);
    td_platform.innerText = platform;
    td_link.append(link_dork)

    tr.append(th);
    tr.append(td_id);
    tr.append(td_domain);
    tr.append(td_desc);
    tr.append(td_platform);
    tr.append(td_link);

    tbody.append(tr)
}