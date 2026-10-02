using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Oguz_Nyzam.API.Filters;

public class SecurityRequirementsOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        operation.Security ??= new List<OpenApiSecurityRequirement>();

        // OpenApi.NET v2.0 (.NET 10 / Swashbuckle v7) durnukly gurluşy:
        var schemeRef = new OpenApiSecuritySchemeReference("Bearer");

        var requirement = new OpenApiSecurityRequirement
        {
            [schemeRef] = new List<string>()
        };

        operation.Security.Add(requirement);
    }
}