package dev.xann.baggle;

import android.os.Bundle; // <-- This is what was missing
import android.graphics.Color;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity    {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Make WebView background transparent
        getBridge().getWebView().setBackgroundColor(android.graphics.Color.TRANSPARENT);
    }
}
