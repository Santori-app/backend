import { DateType } from "../enum/DateType.enum";


export class StringUtils {
    public static nonNullString(value : string, defaultValue = ''){
        if (value == undefined || value == null){
            return defaultValue;
        }

        return value;
    }

    public static trim(value : string) : string{
        return StringUtils.nonNullString(value).trim();
    }

    public static isEmpty(value : string) : boolean{
        return StringUtils.trim(value).length == 0;
    }

    public static IsNotEmpty(value : string) : boolean{
        return !StringUtils.isEmpty(value);
    }

    public static Equals(value1 : string, value2 : string, caseSensitive : boolean = true) : boolean{
        if (caseSensitive){            
            return StringUtils.nonNullString(value1) == StringUtils.nonNullString(value2);
        }

        return StringUtils.nonNullString(value1).toUpperCase() == StringUtils.nonNullString(value2).toUpperCase();
    }

    public static PrepareXMLToJSON(AXML : string) : string{        
        AXML = AXML.replace(/&/g , '&amp;', );
        AXML = AXML.replace(/"/g , '&quot;');
        AXML = AXML.replace(/""/g, '&#39;' );
        AXML = AXML.replace(/</g , '&lt;'  );
        AXML = AXML.replace(/>/g , '&gt;'  );
        AXML = AXML.replace(/\//g, '&#x2F;');

        return AXML;
    }

    public static PestoreXMLFromJSON(AJSONXml){
        AJSONXml = AJSONXml.replace('&amp;', '&');
        AJSONXml = AJSONXml.replace('&quot;', '"');
        AJSONXml = AJSONXml.replace('&#39;', '""');
        AJSONXml = AJSONXml.replace('&lt;', '<');
        AJSONXml = AJSONXml.replace('&gt;', '>');
        AJSONXml = AJSONXml.replace('&#x2F;', '/');
    }

    public static StartWithNumber(value : string) : boolean {
        if (StringUtils.nonNullString(value).match(/^\d/)){
            return true;
        }

        return false;
    }

    public static RemoveDots(value : string){
        return value.replace(/\./g, '');
    }

    public static IsNumeric(value : any){
        return !isNaN(value);
    }

    public static HasWhiteSpace(value) {
      return value.indexOf(' ') >= 0;
    }

    public static GetTodayDate(vpTodayDateTypes : DateType, delimiter : string = '-'){
      if (vpTodayDateTypes == DateType["YY/MM/DD"]){
        return new Date().getFullYear().toString() + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + ("0" + new Date().getDate()).slice(-2);
      }
      
      if (vpTodayDateTypes == DateType["YY/MM/DD/HH/MM"]){
        return new Date().getFullYear().toString() + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + ("0" + new Date().getDate()).slice(-2) + ' - ' + new Date().getHours() + ':' + new Date().getMinutes();
      }

      if (vpTodayDateTypes == DateType["YY/MM/DD/HH/MM/SS"]){
        return new Date().getFullYear().toString() + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + ("0" + new Date().getDate()).slice(-2) + ' - ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
      }

      if (vpTodayDateTypes == DateType["DD/MM/YY"]){
        return ("0" + new Date().getDate()).slice(-2) + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + new Date().getFullYear().toString();
      }

      if (vpTodayDateTypes == DateType["DD/MM/YY/HH/MM"]){
        return ("0" + new Date().getDate()).slice(-2) + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + new Date().getFullYear().toString() + ' - ' + new Date().getHours() + ':' + new Date().getMinutes();
      }

      if (vpTodayDateTypes == DateType["DD/MM/YY/HH/MM/SS"]){
        return ("0" + new Date().getDate()).slice(-2) + delimiter + ("0" + Number(new Date().getMonth() + 1).toString()).slice(-2) + delimiter + new Date().getFullYear().toString() + ' - ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
      }
    }

    public static ToBase64(text: string) : string{
      return Buffer.from(text).toString("base64");
    }

    public static FromBase64(text: string) : string{
      return Buffer.from(text, 'base64').toString('binary');
    }
}