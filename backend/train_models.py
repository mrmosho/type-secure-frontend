import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def train_sensitive_data_model():
    print("\n=== Training Sensitive Data Detection Model ===")
    # Load the dataset
    print("Loading sensitive data dataset...")
    df = pd.read_csv('Dataset/synthetic_sensitive_data.csv')
    
    # Split the data into features (X) and target (y)
    X = df['text']
    y = df['is_sensitive']
    
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Convert text to TF-IDF features
    print("Converting text to TF-IDF features...")
    tfidf = TfidfVectorizer(max_features=5000)
    X_train_tfidf = tfidf.fit_transform(X_train)
    X_test_tfidf = tfidf.transform(X_test)
    
    # Train the Random Forest Classifier
    print("Training Random Forest Classifier...")
    rf_classifier = RandomForestClassifier(
        n_estimators=100,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42
    )
    rf_classifier.fit(X_train_tfidf, y_train)
    
    # Make predictions
    y_pred = rf_classifier.predict(X_test_tfidf)
    
    # Print model performance
    print("\nModel Performance:")
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model and vectorizer
    print("\nSaving model and vectorizer...")
    os.makedirs('models', exist_ok=True)
    joblib.dump(rf_classifier, 'models/sensitive_data_model.joblib')
    joblib.dump(tfidf, 'models/sensitive_data_vectorizer.joblib')
    print("Model and vectorizer saved successfully!")

def train_ner_model():
    print("\n=== Training NER Model ===")
    # Load the dataset in chunks due to its large size
    print("Loading NER dataset...")
    chunk_size = 10000  # Adjust based on your system's memory
    
    # Try different encodings
    encodings = ['utf-8', 'latin1', 'cp1252', 'iso-8859-1']
    
    for encoding in encodings:
        try:
            print(f"\nTrying encoding: {encoding}")
            # Initialize the vectorizer
            tfidf = TfidfVectorizer(max_features=5000)
            rf_classifier = RandomForestClassifier(
                n_estimators=100,
                max_depth=None,
                min_samples_split=2,
                min_samples_leaf=1,
                random_state=42
            )
            
            # Process the first chunk to fit the vectorizer
            print("Processing first chunk to fit vectorizer...")
            first_chunk = pd.read_csv('Dataset/ner_dataset.csv', 
                                    nrows=chunk_size, 
                                    encoding=encoding,
                                    on_bad_lines='skip')  # Skip bad lines
            X = first_chunk['text'] if 'text' in first_chunk.columns else first_chunk.iloc[:, 0]
            y = first_chunk['label'] if 'label' in first_chunk.columns else first_chunk.iloc[:, 1]
            X = X.astype(str)  # Ensure all data is string
            
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            X_train_tfidf = tfidf.fit_transform(X_train)
            X_test_tfidf = tfidf.transform(X_test)
            
            # Train initial model
            print("Training initial model...")
            rf_classifier.fit(X_train_tfidf, y_train)
            
            # Process remaining chunks
            print("Processing remaining chunks...")
            for chunk in pd.read_csv('Dataset/ner_dataset.csv', 
                                   chunksize=chunk_size, 
                                   skiprows=chunk_size, 
                                   encoding=encoding,
                                   on_bad_lines='skip'):  # Skip bad lines
                X = chunk['text'] if 'text' in chunk.columns else chunk.iloc[:, 0]
                y = chunk['label'] if 'label' in chunk.columns else chunk.iloc[:, 1]
                X = X.astype(str)  # Ensure all data is string
                
                X_chunk_tfidf = tfidf.transform(X)
                rf_classifier.fit(X_chunk_tfidf, y)
            
            # Make predictions on test set
            y_pred = rf_classifier.predict(X_test_tfidf)
            
            # Print model performance
            print("\nModel Performance:")
            print("Accuracy:", accuracy_score(y_test, y_pred))
            print("\nClassification Report:")
            print(classification_report(y_test, y_pred))
            
            # Save the model and vectorizer
            print("\nSaving model and vectorizer...")
            os.makedirs('models', exist_ok=True)
            joblib.dump(rf_classifier, 'models/ner_model.joblib')
            joblib.dump(tfidf, 'models/ner_vectorizer.joblib')
            print("Model and vectorizer saved successfully!")
            return  # Exit if successful
            
        except UnicodeDecodeError:
            print(f"Failed with encoding: {encoding}")
            continue
        except Exception as e:
            print(f"Error with encoding {encoding}: {str(e)}")
            continue
    
    print("\nFailed to process NER dataset with any of the attempted encodings.")

if __name__ == "__main__":
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Train both models
    train_sensitive_data_model()
    train_ner_model() 