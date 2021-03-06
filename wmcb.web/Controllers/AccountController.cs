﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using wmcb.model.Security;
using wmcb.model.View;
using wmcb.repo;

namespace wmcb.adminportal.Controllers
{
    public class AccountController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index(LoginViewModel model, string returnUrl = "")
        {
            if (ModelState.IsValid)
            {
                var user = new UsersRepo().getLoggedInUser(model.UserName, model.Password);
                if (user != null)
                {
                   // var roles = user.Roles.Select(m => m.RoleName).ToArray();
                    CustomPrincipalSerializeModel serializeModel = new CustomPrincipalSerializeModel();
                    serializeModel.ID = user.ID;
                    serializeModel.FirstName = user.FirstName;
                    serializeModel.LastName = user.LastName;
                    //serializeModel.roles = roles;

                    string userData = JsonConvert.SerializeObject(serializeModel);
                    FormsAuthenticationTicket authTicket = new FormsAuthenticationTicket(
                    1,
                    user.Email,
                    DateTime.Now,
                    DateTime.Now.AddMinutes(15),
                    false, //pass here true, if you want to implement remember me functionality
                    userData);

                    string encTicket = FormsAuthentication.Encrypt(authTicket);
                    HttpCookie faCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encTicket);
                    Response.Cookies.Add(faCookie);

                    //if (roles.Contains("Admin"))
                    //{
                    //    return RedirectToAction("Index", "Admin");
                    //}
                    //else if (roles.Contains("User"))
                    //{
                    //    return RedirectToAction("Index", "User");
                    //}
                    //else
                    //{
                        return RedirectToAction("Index", "Home");
                    //}
                }

                ModelState.AddModelError("", "Incorrect username and/or password");
            }

            return View(model);
        }

        [AllowAnonymous]
        public ActionResult LogOut()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Account", null);
        }
    }

}