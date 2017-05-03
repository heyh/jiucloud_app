//
//  QuickLookPlugIn.m
//  com.ht.quicklook
//
//  Created by hangke on 16-01-13.
//
//

#import "QuickLookPlugIn.h"
#define TEMP_DATA_PATH      @"tmpData"
#define SHARE_DATA_PATH     @"Inbox"

@implementation QuickLookPlugIn

-(void)initial:(CDVInvokedUrlCommand*)command{
    //do nithng,because Cordova plugin use lazy load mode.
}

-(void) openFile:(CDVInvokedUrlCommand *)command{
    fileUrl = [command argumentAtIndex:0];
    if(![fileUrl isEqualToString:@""]){
        [self showQuickLook];
    }
}

-(void)shareFile:(CDVInvokedUrlCommand *)command{
    NSString *_fileUrl = [command argumentAtIndex:0];
    if(![_fileUrl isEqualToString:@""]){
        [self _shareFile:_fileUrl];
    }
}

-(void)showQuickLook{
    NSURL *URL = [NSURL URLWithString:[fileUrl stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
    if (URL) {
        // Initialize Document Interaction Controller
        documentInteractionController = [UIDocumentInteractionController
                                                        interactionControllerWithURL:URL];
        // Configure Document Interaction Controller
        [documentInteractionController setDelegate:self];
       
        // Preview PDF
        [documentInteractionController presentPreviewAnimated:YES];
    }
}

- (UIViewController *)documentInteractionControllerViewControllerForPreview:(UIDocumentInteractionController *)controller{
    return self.viewController;
}

-(void)_shareFile:(NSString *)_fileUrl{
    // override to handle urls sent to your app
    // register your url schemes in your App-Info.plist
    NSURL* url = [NSURL URLWithString:_fileUrl];
    
    if ([url isKindOfClass:[NSURL class]]) {
        BOOL  retVal = YES;
        NSError *error;
        NSArray *paths =NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask, YES);
        NSString *documentsDirectory =[paths objectAtIndex:0];
        NSString *fileName = [url lastPathComponent];
//        NSString *destDataDir = [documentsDirectory stringByAppendingPathComponent:TEMP_DATA_PATH];
        NSString *destDataDir = documentsDirectory;
        NSString *shareDataDir = [documentsDirectory stringByAppendingPathComponent:SHARE_DATA_PATH];
        [self createFolder:destDataDir];
        NSString *destDataPath = [destDataDir stringByAppendingPathComponent:fileName];
        NSString *shareDataPath = [shareDataDir stringByAppendingPathComponent:fileName];
        
        if (![[NSFileManager defaultManager] fileExistsAtPath:destDataPath])
        {
          retVal = [[NSFileManager defaultManager] copyItemAtPath:shareDataPath toPath:destDataPath error:&error];
        }
        [self clearInbox];
        if (retVal) {
            fileUrl = [[NSString stringWithFormat:@"file://"] stringByAppendingString:destDataPath];
            [self showQuickLook];
        }
    }
}

- (void)createFolder:(NSString *)createDir
{
    BOOL isDir = NO;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    BOOL existed = [fileManager fileExistsAtPath:createDir isDirectory:&isDir];
    if ( !(isDir == YES && existed == YES) )
    {
        [fileManager createDirectoryAtPath:createDir withIntermediateDirectories:YES attributes:nil error:nil];
    }
}

-(BOOL)clearInbox{
    NSError *error;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    
    NSArray *contents = [fileManager contentsOfDirectoryAtPath:documentsDirectory error:&error];
    NSEnumerator *e = [contents objectEnumerator];
    NSString *filename;
    while ((filename = [e nextObject])) {
        if ([filename isEqualToString:SHARE_DATA_PATH]) {
            [fileManager removeItemAtPath:[documentsDirectory stringByAppendingPathComponent:filename] error:&error];
        }
    }
    if(nil != error){
        return NO;
    }else{
        return YES;
    }
}


@end
