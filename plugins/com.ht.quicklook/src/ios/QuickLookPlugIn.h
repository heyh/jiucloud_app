//
//  QuickLookPlugIn.h
//  com.ht.quicklook
//
//  Created by hangke on 16-01-13.
//
//
#import <Cordova/CDV.h>

@interface QuickLookPlugIn : CDVPlugin<UIDocumentInteractionControllerDelegate>{
    UIDocumentInteractionController *documentInteractionController;
    NSString *fileUrl;
}

- (void) openFile:(CDVInvokedUrlCommand*)command;

- (void) shareFile:(CDVInvokedUrlCommand*)command;

@end

