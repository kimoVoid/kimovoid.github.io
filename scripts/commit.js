$.ajax({
    dataType: "json",
    url: "https://api.github.com/repos/kimovoid/kimovoid.github.io/commits",
    success: function(data) {
        $('#commit').empty();
        $('#commit').append(`
        <span id="commit" class="tooltip">
            Last commit: ${(data[0].sha).substring(0, 7)}
            <span class="tooltiptext commit-tooltip">
                <div>
                    <a href="https://github.com/kimovoid/kimovoid.github.io/commit/${data[0].sha}" target="_blank">${(data[0].sha).substring(0, 7)}</a>
                </div>
                ${(data[0].commit.author.date).replace('T', ' ').replace('Z', ' ')}
            </span>
        </span>
        `);

        //$('#commit').append("Last commit: " + (data[0].sha).substring(0, 7));
        //$('.commit-tooltip').text((data[0].commit.author.date).replace('T', ' ').replace('Z', ' '));
    }
});